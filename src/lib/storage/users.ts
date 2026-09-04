import { seedPatients } from "@/lib/mock-data/accounts";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const STORAGE_KEY = "schedula_users";

function readUsers(): StoredUser[] {
  const storedUsers = localStorage.getItem(STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function ensureSeedUsers() {
  const users = readUsers();
  const merged = [...users];

  for (const seed of seedPatients) {
    const exists = merged.some(
      (user) => user.email.toLowerCase() === seed.email.toLowerCase(),
    );

    if (!exists) {
      merged.push(seed);
    }
  }

  if (merged.length === 0) {
    writeUsers(seedPatients);
    return seedPatients;
  }

  if (merged.length !== users.length) {
    writeUsers(merged);
  }

  return merged;
}

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  return ensureSeedUsers();
}

export function saveUser(user: StoredUser): void {
  const users = getUsers();
  const email = user.email.trim().toLowerCase();

  if (users.some((existing) => existing.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }

  writeUsers([...users, user]);
}

export function updateUser(
  id: string,
  updates: Partial<Pick<StoredUser, "name" | "email" | "password">>,
): StoredUser {
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    throw new Error("User account not found.");
  }

  const currentUser = users[userIndex];
  const nextEmail = updates.email?.trim().toLowerCase() ?? currentUser.email;

  if (
    nextEmail !== currentUser.email.toLowerCase() &&
    users.some(
      (existing) =>
        existing.id !== id && existing.email.toLowerCase() === nextEmail,
    )
  ) {
    throw new Error("An account with this email already exists.");
  }

  const updatedUser: StoredUser = {
    ...currentUser,
    ...updates,
    name: updates.name?.trim() ?? currentUser.name,
    email: nextEmail,
  };

  const nextUsers = [...users];
  nextUsers[userIndex] = updatedUser;
  writeUsers(nextUsers);

  return updatedUser;
}
