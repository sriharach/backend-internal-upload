const fastify = require('fastify')({ logger: true })
const helmet = require('@fastify/helmet')
const { uploadsModule } = require('./upload')
const static = require('@fastify/static')
const path = require('path')
const multipart = require('@fastify/multipart')

fastify.register(
  helmet,
  { contentSecurityPolicy: false }
)

fastify.register(multipart, {
  prefix: 'public'
})

fastify.register(static, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

fastify.post('/internal/upload/:country_id/:ticpid_id', uploadsModule)

fastify.get('/another/path', function (req, reply) {
  reply.sendFile('/image/photo_2566-08-18 14.12.18.jpeg')
})

// Run the server!
fastify.listen({ port: 9000 }, function (err) {
  console.log(`server listening on ${fastify.server.address().port}`)
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})