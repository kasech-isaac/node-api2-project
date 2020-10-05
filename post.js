const express = require("express");
const db = require("./data/db");
const router = express.Router();


//----------POST /api/posts----------
router.post("/api/posts", (req, res) => {
    // request body is missing the title or contents property
    !req.body.title || !req.body.contents ? res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    // information about the post is valid
     : db.insert(req.body)
     .then((post) => {
      res.status(201).json(post);
    })
    //  error while saving the post?
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "There was an error while saving the post to the database"})
    
    })
  })

  //----------Post /api/posts/:id/comments----------
router.post("/api/posts/:id/comments", (req, res) => {

// request body is missing the text property
    !req.body.text ? res.status(400).json({ errorMessage: "Please provide text for the comment." }):
   db.findById(req.paramsid)
   .then(post => {
    //     post with the specified id is not found
        !post == post =="" ?res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
        : db.insertComment({text:req.body.text, post_id:req.params.id})
            .then(comments => {
              db.findPostComments(comments.id)
              .then(post => {
                // information about the comment is valid:
                  res.status(201).json(post)})
            })
          })
            .catch((err) => {
              console.log(err);
              res.status(500).json({error:"There was an error while saving the comment to the database" });
            });
        })

//----------GET /api/posts----------
router.get("/api/posts", (req, res) => {
  db.find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

//----------GET /api/posts:id----------
router.get("/api/posts/:id", (req, res)=>{
db.findById(req.params.id)
.then(post=>{
 !post || post == "" ? res.status(404).json({ errorMessage: "The post with the specified ID does not exist."})
 : res.status(200).json(post)
})
.catch(err=>{
    console.log(err)
 res.status(500).json({message: "The post with the specified ID does not exist." })
})
})




//----------Get /api/posts/:id/comments----------
router.get("/api/posts/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then((comment) => {
      !comment || comment == "" ? res.status(404).json({
            errorMessage: "The post with the specified ID does not exist." })
            :res.status(200).json(comment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "The comments information could not be retrieved." })
    })
});


//----------Delete /api/posts/:id/----------
router.delete("/api/posts/:id", (req, res) => {
    db.findById(req.params.id).then((post) => {
      if (!post || post === "") {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist",
        });
      } else if (post.length > 0) {
        db.remove(req.params.id).then((removeed) => {
          if (removeed === 1) {
            db.find()
              .then((post) => {
                return res.status(200).json(post);
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: "The post could not be removed" });
              });
          }
        });
      }
    });
  });
   

//----------put /api/posts/:id/----------
router.put("/api/posts/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  db.findById(req.params.id).then((post) => {
    if (!post || post === "") {
      return res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
    db.update(req.params.id, req.body)
      .then((post) => {
        if (post === 1) {
          return res.status.json(post);
        }
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  });
});


module.exports = router;
