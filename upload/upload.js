const fs = require('fs')
const util = require('util')
const { pipeline } = require('stream')
const path = require('path')

const pump = util.promisify(pipeline)
const end_point = "http://127.0.0.1:9000"
// const end_point = "http://150.95.25.8:4012"

exports.uploadsModule = async (request, reply) => {
    let path_dir = ''
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
            fs.mkdirSync(initPath, { recursive: true });
        }

        for await (const part of parts) {
            path_dir = `${initPath}/${part.filename}`
            await pump(part.file, fs.createWriteStream(`${initPath}/${part.filename}`))
        }
        reply.status(204)
    } catch (error) {
        reply.send(error)
        if (path_dir) fs.rmSync(path_dir)
    }

}

exports.indexPage = async (request, reply) => {
    try {
        reply.send({ text: "Hello" })
    } catch (error) {
        reply.send(error)
    }
}

exports.fileNameFindPublic = async (request, reply) => {
    try {
        const dir = request.query.dir
        const country_id = request.params.country_id
        const ticpid_id = request.params.ticpid_id

        const founddirs = fs.readdirSync(path.join(__dirname, `/public/${country_id}/${ticpid_id}/${dir || ''}`))
        const data = []
        if (founddirs.length > 0) {
            for (let index = 0; index < founddirs.length; index++) {
                const element = founddirs[index];
                const path_dir = dir ? `${dir}/` : ""
                data.push(`${end_point}/public/${country_id}/${ticpid_id}/${path_dir}${element}`)
            }
        }

        reply.send({
            data
        })

    } catch (error) {
        reply.send(error)
    }
}

exports.removeFileFormPublic = async (request, reply) => {
    try {
        const dir = request.query.dir
        const file_name = request.query.file_name
        const country_id = request.params.country_id
        const ticpid_id = request.params.ticpid_id

        if (!file_name) {
            throw new Error('Not found a file name')
        }
        const path_dir = path.join(__dirname, `/public/${country_id}/${ticpid_id}/${dir || ''}/${file_name}`)
        fs.rmSync(path_dir)
        reply.status(204)


    } catch (error) {
        reply.send(error)
    }
}