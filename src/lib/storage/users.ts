export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const STORAGE_KEY = "schedula_users";

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return [];
  }

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

export function saveUser(user: StoredUser): void {
  const users = getUsers();
  const email = user.email.trim().toLowerCase();

  if (users.some((existing) => existing.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists.");
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...users, user]),
  );
}