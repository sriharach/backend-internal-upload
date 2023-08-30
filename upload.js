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

exports.fileNameFindPublic = async (request, reply) => {
    try {
        const parts = request.files()
        const country_id = request.params.country_id
        const ticpid_id = request.params.ticpid_id

        const founddirs = fs.readdirSync(path.join(__dirname, `/public/${country_id}/${ticpid_id}`))

        let model = {}

        for (let index = 0; index < founddirs.length; index++) {
            const element = founddirs[index];
            model.name[index] = `http://127.0.0.1:9000/public/${country_id}/${ticpid_id}/${element}`
        }

        reply.send(model)

    } catch (error) {
        reply.send(error)
    }
}

exports.removeFileFormPublic = async (request, reply) => {
    try {
        const file_name = request.query.file_name
        const country_id = request.params.country_id
        const ticpid_id = request.params.ticpid_id

        if (!file_name) {
            throw new Error('Not found a file name')
        }
        const path_dir = path.join(__dirname, `/public/${country_id}/${ticpid_id}/${file_name}`)
        fs.rmSync(path_dir)
        reply.status(204)


    } catch (error) {
        reply.send(error)
    }
}