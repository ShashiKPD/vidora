
const registerUser = async (data) => {
  try {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/register", {
      method: "POST"
    })
  } catch (error) {

  }
}