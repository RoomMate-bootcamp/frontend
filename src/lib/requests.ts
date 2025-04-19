/**
 * API client functions for connecting to the backend
 */

const API_BASE = import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:8010/api/v1';

/**
 * Authentication
 */
export async function loginUser(username: string, password: string) {
    console.log("Login attempt:", {username, password});
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username,
                password,
            }),
        });

        console.log("Login response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Login error response:", errorText);
            throw new Error(`Login failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Login success:", data);
        return data;
    } catch (error) {
        console.error("Login fetch error:", error);
        throw error;
    }
}

export async function registerUser(username: string, email: string, password: string) {
    console.log("Register attempt:", {username, email});
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        console.log("Register response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Register error response:", errorText);
            throw new Error(`Registration failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Register success:", data);
        return data;
    } catch (error) {
        console.error("Register fetch error:", error);
        throw error;
    }
}

/**
 * User Profile
 */
export async function getUserProfile(token: string) {
    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch profile: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Profile fetch error:", error);
        throw error;
    }
}

export async function updateUserProfile(token: string, profileData: any) {
    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to update profile: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Profile update error:", error);
        throw error;
    }
}

/**
 * Roommates
 */
export async function getPotentialRoommates(token: string) {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/users/roommates`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                // Add cache control headers to prevent browser caching
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch roommates: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Roommates fetch error:", error);
        throw error;
    }
}

/**
 * Matches
 */
export async function getMatches(token: string) {
    try {
        const response = await fetch(`${API_BASE}/matches/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch matches: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Matches fetch error:", error);
        throw error;
    }
}

export async function createMatch(token: string, roommateId: string | number) {
    try {
        const response = await fetch(`${API_BASE}/matches/${roommateId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create match: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Match creation error:", error);
        throw error;
    }
}

export async function deleteMatch(token: string, matchId: string | number) {
    try {
        const response = await fetch(`${API_BASE}/matches/${matchId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete match: ${response.status} ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error("Match deletion error:", error);
        throw error;
    }
}

/**
 * Likes
 */
export async function likeUser(token: string, likedId: string | number) {
    try {
        const response = await fetch(`${API_BASE}/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                liked_id: typeof likedId === 'string' ? parseInt(likedId) : likedId
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to like user: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Like user error:", error);
        throw error;
    }
}

/**
 * AI
 */
export async function chatWithAI(token: string, message: string) {
    try {
        const response = await fetch(`${API_BASE}/ai-assistant/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                message: message,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to chat with AI: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("AI chat error:", error);
        throw error;
    }
}

export async function getSmartMatches(token: string, limit: number = 10) {
    try {
        const response = await fetch(`${API_BASE}/ai-matching/smart-matches?limit=${limit}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get smart matches: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Smart matches error:", error);
        throw error;
    }
}

/**
 * Notifications
 */
export async function getNotifications(token: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/notifications`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch notifications: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Notifications fetch error:", error);
    throw error;
  }
}
export async function markNotificationAsRead(token: string, notificationId: string | number) {
  try {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/notifications/${notificationId}/read`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to mark notification as read: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Mark notification as read error:", error);
    throw error;
  }
}
export async function markAllNotificationsAsRead(token: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/notifications/read-all`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to mark all notifications as read: ${response.status} ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    throw error;
  }
}
/**
 * AI
 */
export async function getCompatibilityScore(token: string, userId: string | number) {
    try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/ai-matching/${userId}/compatibility`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache"
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get compatibility score: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Compatibility score error:", error);
        throw error;
    }
}