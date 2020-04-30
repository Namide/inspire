const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  GUEST: 'guest'
}

const VISIBILITY = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  PRIVATE: 'private',
  SUBSCRIBER: 'subscribe'
}

const roleToVisibility = role => {
  switch (role) {
    case ROLES.ADMIN:
      return [VISIBILITY.PUBLIC, VISIBILITY.PROTECTED, VISIBILITY.PRIVATE]
    case ROLES.EDITOR:
      return [VISIBILITY.PUBLIC, VISIBILITY.PROTECTED]
    case ROLES.AUTHOR:
      return [VISIBILITY.PUBLIC, VISIBILITY.PROTECTED]
    case ROLES.SUBSCRIBER:
      return [VISIBILITY.PUBLIC, VISIBILITY.PROTECTED]
    case ROLES.GUEST:
      return [VISIBILITY.PUBLIC]
    default:
      throw new Error(role + ' unknow')
  }
}

module.exports.ROLES = ROLES
module.exports.VISIBILITY = VISIBILITY
module.exports.roleToVisibility = roleToVisibility
