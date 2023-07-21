export const getUser = async (walletAddress: string) => {
  try {
    const user = await fetch(
      `${process.env.API_BASE_URL}/v1/users/${walletAddress}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Api-Key ${process.env.API_KEY}`
        }
      }
    ).then(res => res.json());
    return user;
  } catch (error) {
    throw error;
  }
};

export const postUser = async (formData: FormData) => {
  try {
    const user = await fetch(`${process.env.API_BASE_URL}/v1/users/`, {
      method: "POST",
      headers: {
        Authorization: `Api-Key ${process.env.API_KEY}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if ("user" in res) {
          return res.user;
        } else if ("wallet_address" in res) {
          return { error: res.wallet_address };
        }
        return null;
      });
    return user;
  } catch (error) {
    throw error;
  }
};
