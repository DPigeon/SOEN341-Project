const Comment = require('../models/Comment')
const BaseController = require('../Controller')

module.exports.create = (req, res) => {
    console.log("POST request at " + req.originalUrl)
    console.log("Entering CommentController.create handler")

    const { test, isAuthorized } = BaseController.determineTestAndAuth(req)
    console.log("test =>", test)

    console.log("isAuthorized =>", isAuthorized)
    if (isAuthorized) {
        const { author_email, data, post_id } = req.body
        const newComment = new Comment(author_email, data, post_id)
        const { success, message } = Comment.persist({ newComment, test })

        if (!success) {
            return res.status(400).json({ success: false, message })
        }
        return res.status(200).json({ success, message })
    }
    return res.status(403).json({ success: false, message: 'UnAuthorized' })
}
