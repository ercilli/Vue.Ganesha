import { getAccessToken } from './authService.js';
import { handleError } from '../Components/ErrorHandler.js';

//const baseUrl = 'https://localhost:7182/api';
const baseUrl = 'https://vivero-ganesha-api.fly.dev/api';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
}

export async function fetchUsers() {
  try {
    const response = await fetch(`${baseUrl}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await handleResponse(response);
  } catch (error) {
    handleError(error, 'fetching users');
    throw error;
  }
}

export async function updateUserRole(userId, newRole) {
  try {
    const response = await fetch(`${baseUrl}/admin/update-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
      body: JSON.stringify({ userId, newRole })
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return await handleResponse(response);
  } catch (error) {
    handleError(error, 'updating user role');
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const response = await fetch(`${baseUrl}/admin/delete/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return await handleResponse(response);
  } catch (error) {
    handleError(error, 'deleting user');
    throw error;
  }
}