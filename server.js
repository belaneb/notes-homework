var fs  = require("fs")
var path = require("path")
var express = require("express")
var uuid = require("uuid")

var app = express()

var PORT = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

//app.use("/", express.static(path.join(__dirname, "/")))

app.get("/test", (req, res) => {
    res.send("hello")
});

//create route
app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname,"/public/notes.html"))
})

app.get("/api/notes", function(req,res){
    fs.readFile("../db/db.json", "utf-8", function(err,data){
        if(err) throw err
        res.send(data)
    })
    
})
app.post("/api/notes", function(req,res){
    var title = req.body.title
    var text = req.body.text

    fs.readFile("../db/db.json", "utf-8", function(err, data){
        if(err) throw err

        //store the data from db.json to temporary variable
        var temp = ""

        if(data !=null){
            temp = JSON.parse(data)
        }

        //push the new object to the temporary json object
        temp.push(
            {
                "id": uuid.v4(),
                "title": title,
                "text" : text
            }
        )

        //convert the json object to text/string
        temp = JSON.stringify(temp)

        //write the new notes to db file
        fs.writeFileSync("../db/db.json", temp, "utf-8")

        //return the newly added note
        res.send(temp)
    })

})
app.delete("/api/notes/:id", function(req,res){
    var id = req.params.id

    fs.readFile("../db/db.json", "utf-8", function(err, data){
        if(err) throw err

        //store the data from db.json to temporary variable
        var temp = ""

        if(data !=null){
            temp = JSON.parse(data)
        }

        //remove the note with the same id
        temp = temp.filter(function(val){
            if(id != val.id){
                return val
            }
        })

        //convert the json object to text/string
        temp = JSON.stringify(temp)

        //write the new notes to db file
        fs.writeFileSync("../db/db.json", temp, "utf-8")

        //return the newly added note
        res.send(temp)
    })

})
// app.get("/*", function(req,res){
//     res.sendFile(path.join(__dirname,"/index.html"))
// })

console.log(PORT)
// Run Server
app.listen(PORT, function(){
    console.log("Server Started Running")
})