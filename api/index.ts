import { Order } from 'types/order';
import { Token } from 'types/token';

export const getUserByWalletAddress = async (walletAddress: string) => {
  try {
    const user = await fetch(`${process.env.API_BASE_URL}/v1/users/wallet/${walletAddress}/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    }).then((res) => res.json());
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserBySlug = async (slug: string) => {
  try {
    const user = await fetch(`${process.env.API_BASE_URL}/v1/users/s/${slug}/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    }).then((res) =>res.json());
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUsingSlug = async (slug: string) => {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/v1/users/s/${slug}/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
};


export const postUser = async (formData: FormData) => {
  try {
    const user = await fetch(`${process.env.API_BASE_URL}/v1/users/`, {
      method: 'POST',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if ('user' in res) {
          return res.user;
        } else if ('wallet_address' in res) {
          return { error: res.wallet_address };
        }
        return null;
      });
    return user;
  } catch (error) {
    throw error;
  }
};

export const postPayment = async (formData: FormData) => {
  try {
    const payment = await fetch(`${process.env.API_BASE_URL}/v1/payments/`, {
      method: 'POST',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
      body: formData,
    });
    return payment;
  } catch (error) {
    throw error;
  }
};

export const getContracts = async () => {
  try {
    const contracts = await fetch(`${process.env.API_BASE_URL}/v1/contracts/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        return Array.isArray(res) ? res : [];
      });
    return contracts;
  } catch (error) {
    throw error;
  }
};

export const getTokens = async (userId: string): Promise<Token[]> => {
  try {
    const tokens = await fetch(`${process.env.API_BASE_URL}/v1/tokens/user/${userId}/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        return Array.isArray(res) ? res : [];
      });
    return tokens;
  } catch (error) {
    throw error;
  }
};

export const getToken = async (tokenId: string): Promise<Token> => {
  try {
    const token = await fetch(`${process.env.API_BASE_URL}/v1/tokens/${tokenId}/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    }).then((res) => res.json());
    return token;
  } catch (error) {
    throw error;
  }
};

export const postToken = async (formData: FormData) => {
  try {
    const token = await fetch(`${process.env.API_BASE_URL}/v1/tokens/`, {
      method: 'POST',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
      body: formData,
    }).then((res) => res.json());
    return token;
  } catch (error) {
    throw error;
  }
};

export const patchToken = async (tokenId: string, formData: FormData) => {
  try {
    const token = await fetch(`${process.env.API_BASE_URL}/v1/tokens/${tokenId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
      body: formData,
    }).then((res) => res.json());
    return token;
  } catch (error) {
    throw error;
  }
};

export const patchAsset = async (assetId: string, formData: FormData) => {
  try {
    const token = await fetch(`${process.env.API_BASE_URL}/v1/tokens/asset/${assetId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
      body: formData,
    }).then((res) => res.json());
    return token;
  } catch (error) {
    throw error;
  }
};

export const patchUser = async (userId: string, formData: FormData) => {
  try {
    const token = await fetch(`${process.env.API_BASE_URL}/v1/users/${userId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
      body: formData,
    });

    if (!token.ok) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const deleteAsset = async (assetId: string) => {
  try {
    const isDeleted = await fetch(
      `${process.env.API_BASE_URL}/v1/tokens/asset/delete/${assetId}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Api-Key ${process.env.API_KEY}`,
        },
      },
    ).then((res) => res.status === 204);
    return isDeleted;
  } catch (error) {
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const orders = await fetch(`${process.env.API_BASE_URL}/v1/users/${userId}/orders/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        return Array.isArray(res) ? res : [];
      });
    return orders;
  } catch (error) {
    throw error;
  }
};

export const getUserSales = async (userId: string): Promise<Order[]> => {
  try {
    const orders = await fetch(`${process.env.API_BASE_URL}/v1/users/${userId}/sales/`, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        return Array.isArray(res) ? res : [];
      });
    return orders;
  } catch (error) {
    throw error;
  }
};
