const fs = require('fs')
const util = require('util')
const { pipeline } = require('stream')
const path = require('path')

const pump = util.promisify(pipeline)

exports.uploadsModule = async (request, reply) => {
    try {
        const parts = await request.files()
        const dir = request.query.dir
        const country_id = request.params.country_id
        const ticpid_id = request.params.ticpid_id

        const countryPathSet = path.join(__dirname, `/public/${country_id}`)
        const toppicPathSet = path.join(__dirname, `/public/${country_id}/${ticpid_id}`)
        const initPath = path.join(__dirname, `/public/${country_id}/${ticpid_id}/${dir || ''}`)

        if (!fs.existsSync(countryPathSet)) {
            fs.mkdirSync(countryPathSet);
        }
        if (!fs.existsSync(toppicPathSet)) {
            fs.mkdirSync(toppicPathSet);
        }
        if (!fs.existsSync(initPath)) {
            fs.mkdirSync(initPath);
        }

        for await (const part of parts) {
            await pump(part.file, fs.createWriteStream(`${initPath}/${part.filename}`))

        }
        reply.status(204)
    } catch (error) {
        reply.send(error)
    }

}
