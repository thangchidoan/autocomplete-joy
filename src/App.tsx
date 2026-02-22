import { useState, useRef, useMemo, useEffect, forwardRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
    Autocomplete,
    AutocompleteOption,
    Box,
    Typography,
    Sheet,
} from "@mui/joy";
import { UserOption } from "./components/UserOption";
import { fetchUsers } from "./api/mockApi";

const ITEMS_PER_PAGE = 20;

function App() {
    const [open, setOpen] = useState(false);
    const listboxRef = useRef<HTMLUListElement>(null);
    const sentinelRef = useRef<HTMLLIElement>(null);

    // Infinite query using TanStack Query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["users"],
        queryFn: ({ pageParam = 1 }) => fetchUsers(pageParam, ITEMS_PER_PAGE),
        getNextPageParam: (lastPage) => {
            // Return the next page number if there are more pages, otherwise undefined
            return lastPage.hasMore ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: open, // Only fetch when dropdown is open
    });

    // Flatten all pages into a single array of users
    const users = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? [];
    }, [data]);

    // Intersection Observer to detect when user scrolls near bottom
    useEffect(() => {
        const listbox = listboxRef.current;
        const sentinel = sentinelRef.current;

        if (!listbox || !sentinel || !hasNextPage || isFetchingNextPage) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                // When sentinel element is visible and there are more pages, fetch next
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            {
                root: listbox, // Important: set root to the scrolling container
                rootMargin: "100px",
                threshold: 0,
            }
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, open, users.length]);

    const ListboxComponent = useMemo(() => {
        return forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
            function Listbox(props, ref) {
                const { children, ...other } = props;
                return (
                    <ul {...other} ref={(node) => {
                        listboxRef.current = node;
                        if (typeof ref === 'function') ref(node);
                        else if (ref) ref.current = node;
                    }}>
                        {children}
                        <li ref={sentinelRef} aria-hidden style={{ height: 1 }} />
                    </ul>
                );
            }
        );
    }, []);

    return (
        <Sheet
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                bgcolor: "background.body",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    p: 3,
                    borderRadius: "sm",
                    boxShadow: "md",
                    bgcolor: "background.surface",
                    position: "relative",
                }}
            >
                <Typography level="h2" sx={{ mb: 3, textAlign: "center" }}>
                    MUI Joy UI Autocomplete
                    <br />
                    <Typography level="body-sm" textColor="text.tertiary">
                        with Infinite Scroll (Smooth Loading)
                    </Typography>
                </Typography>

                <Autocomplete
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    options={users}
                    loading={isLoading && users.length === 0}
                    getOptionLabel={(user) => user?.name ?? ""}
                    isOptionEqualToValue={(option, value) =>
                        option?.id === value?.id
                    }
                    slots={{ listbox: ListboxComponent }}
                    slotProps={{
                        listbox: {
                            sx: {
                                maxHeight: 300,
                                overflowAnchor: "none",
                            },
                        },
                        loading: {
                            sx: {
                                display: users.length === 0 ? "flex" : "none",
                            },
                        },
                    }}
                    renderOption={(props, user) => (
                        <AutocompleteOption {...props} key={user.id}>
                            <UserOption user={user} />
                        </AutocompleteOption>
                    )}
                    placeholder="Search for a user..."
                />

                {/* Show message when no more users */}
                {!hasNextPage && users.length > 0 && (
                    <Typography
                        level="body-xs"
                        textColor="text.tertiary"
                        sx={{ textAlign: "center", mt: 1 }}
                    >
                        All users loaded ({users.length} total)
                    </Typography>
                )}

                {/* Show error message if fetch failed */}
                {isError && (
                    <Typography
                        level="body-xs"
                        color="danger"
                        sx={{ textAlign: "center", mt: 1 }}
                    >
                        Failed to load users. Please try again.
                    </Typography>
                )}

                {/* Instructions */}
                <Typography
                    level="body-xs"
                    textColor="text.tertiary"
                    sx={{ textAlign: "center", mt: 2 }}
                >
                    Open the dropdown and scroll down to load more users
                </Typography>
            </Box>
        </Sheet>
    );
}

export default App;
