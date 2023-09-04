const fastify = require('fastify')({ logger: true })
const helmet = require('@fastify/helmet')
const { uploadsModule, fileNameFindPublic, removeFileFormPublic } = require('./upload')
const static = require('@fastify/static')
const path = require('path')
const multipart = require('@fastify/multipart')
const cors = require('@fastify/cors')

fastify.register(
  helmet,
  { contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }
)

fastify.register(cors, {
  origin: true
})

fastify.register(multipart, {
  prefix: 'public',
  limits: {
    fieldSize: 10240,
  }
})

fastify.register(static, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

fastify.post('/internal/upload/:country_id/:ticpid_id', uploadsModule)
fastify.get('/internal/public/:country_id/:ticpid_id', fileNameFindPublic)
fastify.delete('/internal/public/:country_id/:ticpid_id/remove', removeFileFormPublic)

fastify.get('/another/path', async function (req, reply) {

  reply.sendFile('/image/photo_2566-08-18 14.12.18.jpeg')
})

// Run the server!
fastify.listen({ port: 4012 }, function (err) {
  console.log(`server listening on ${fastify.server.address().port}`)
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})