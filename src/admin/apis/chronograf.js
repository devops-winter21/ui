import AJAX from 'src/utils/ajax'

export const getUsers = async url => {
  try {
    return await AJAX({
      method: 'GET',
      url,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getOrganizations = async url => {
  try {
    return await AJAX({
      method: 'GET',
      url,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const createUser = async (url, user) => {
  try {
    return await AJAX({
      method: 'POST',
      url,
      data: user,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteUser = async url => {
  try {
    return await AJAX({
      method: 'DELETE',
      url,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const createOrganization = async (url, organization) => {
  try {
    return await AJAX({
      method: 'POST',
      url,
      data: organization,
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
