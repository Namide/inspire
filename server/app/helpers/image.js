
module.exports.validator = () => {
  return {
    bsonType: 'object',
    required: ['width', 'height', 'src'],
    properties: {
      width: {
        bsonType: 'number'
      },
      height: {
        bsonType: 'number'
      },
      src: {
        bsonType: 'string'
      }
    }
  }
}
