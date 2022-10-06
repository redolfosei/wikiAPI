const express = require("express"); 
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 

const port = process.env.PORT || 3000; 

const app = express(); 

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

///////////// Request targeting all Articles /////////////////// 
app.route("/articles")
    .get((req,res)=>{
        Article.find((err,foundArticles)=>{
            if(!err){
                res.send(foundArticles);
            } else {
                res.send(err);
            }
            
        });
    })

    .post((req,res)=>{
        const newArticle = new Article({
         title: req.body.title,
         content: req.body.content
        });
     
        newArticle.save((err)=>{
         if(!err){
             res.send("Successfully added a new article")
         } else{
             res.send(err);
         }
        });
     })

    .delete((req,res)=>{
        Article.deleteMany((err)=>{
            if(!err){
                res.send("Deleted successfully!");
            }else {
                console.log(err);
            }
        });
    });


///////////// Request targeting A Specific Article /////////////////// 
app.route("/articles/:articleTitle")
    .get((req,res)=>{
        Article.findOne(
            {title: req.params.articleTitle},(err,foundArticle)=>{
                if(foundArticle){
                    res.send(foundArticle);
                } else{
                    res.send("No article of such title was found")
                }
            }
        )
    })

    .put((req,res)=>{
        Article.updateOne({title: req.params.articleTitle},
                {title: req.body.title, content: req.body.content},
                // {overwrite: true}, depreciated;
                (err)=>{
                    if(!err){
                        res.send("Successfully updated the article");
                    } else {
                        res.send(err);
                    }
                });
    })

    .patch((req,res)=>{
        Article.updateOne({title: req.params.articleTitle},
            {$set: req.body},
            (err)=>{
                if(!err){
                    res.send("Successfully updated");
                } else {
                    res.send(err);
                }
            }
            );
    })

    .delete((req,res)=>{
        Article.deleteOne({title: req.params.articleTitle},
            (err)=>{
                if(!err){
                    res.send("Successfully removed")
                } else {
                    res.send(err)
                    }
                }
            )
        }
    )


app.get("/",(req,res)=>{
    res.send("TTT"); 
});








app.listen(port,()=>{
    console.log("app is listening on " + port); 
});