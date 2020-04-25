
module.exports.validator = () => {
  return {
    bsonType: 'object',
    required: ['width', 'height', 'src'],
    properties: {
      width: {
        bsonType: 'int',
        description: 'must be an integer'
      },
      height: {
        bsonType: 'int',
        description: 'must be an integer'
      },
      src: {
        bsonType: 'string'
      }
    }
  }
}
