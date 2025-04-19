export async function loginUser(username: string, password: string) {
  return await (
    await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
  ).json();
}

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  return await (
    await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    })
  ).json();
}

export async function getMatches(token: string) {}

export async function getUserById(id: string) {}

export async function getUsers(token: string) {}
