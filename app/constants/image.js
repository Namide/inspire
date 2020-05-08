
module.exports.VALIDATOR = {
  bsonType: 'object',
  required: ['width', 'height', 'src'],
  properties: {
    colors: {
      bsonType: 'array',
      items: {
        bsonType: 'object',
        properties: {
          area: {
            bsonType: 'double'
          },
          hexa: {
            bsonType: 'string'
          }
        }
      }
    },
    colorsRound: {
      bsonType: 'array',
      items: {
        bsonType: 'int'
      }
    },
    width: {
      bsonType: 'int'
    },
    height: {
      bsonType: 'int'
    },
    src: {
      bsonType: 'string'
    },
    type: {
      bsonType: 'string'
    }
  }
}
