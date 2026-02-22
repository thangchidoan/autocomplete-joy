import type { User, FetchUsersResponse } from '../types/user';

// Mock data for generating users
const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'proton.me'];

/**
 * Generate a deterministic user based on the id
 */
function generateUser(id: number): User {
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[(id * 7) % lastNames.length];
  const domain = domains[(id * 3) % domains.length];

  return {
    id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    avatar: `https://i.pravatar.cc/150?img=${(id % 70) + 1}`, // Using pravatar.cc for avatars
  };
}

/**
 * Simulated API delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock API function to fetch users with pagination
 * Simulates a real API call with delay
 */
export async function fetchUsers(page: number, limit: number = 20): Promise<FetchUsersResponse> {
  // Simulate network delay (1500-2500ms)
  await delay(1500 + Math.random() * 1000);

  // Generate mock users for this page
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Simulate a maximum of 200 users total (10 pages)
  const maxUsers = 200;
  const hasMore = endIndex < maxUsers;

  const users: User[] = [];
  for (let i = startIndex; i < Math.min(endIndex, maxUsers); i++) {
    users.push(generateUser(i + 1));
  }

  return {
    data: users,
    hasMore,
    page,
  };
}
