const db=require("../sequelize/index.js")
module.exports={
addComments:(req,res)=>{
    db.review.create({
        comment:req.body.comment,
        userId:req.params.idd,
        productId:req.body.productId
    }).then((response)=>{
  res.json(response) })
  .catch((error)=>res.json(error))
},

getcommentsForThisProduct:(req,res)=>{
    db.review.findAll({where:{productId:req.params.idd},
        include: {
            model: db.users, // تأكد من أن اسم النموذج المستخدم صحيح
            attributes: ['photoDeprofile', 'username', 'email','firstname','lastname'], // اختر الأعمدة التي تريدها من جدول المستخدمين
        }})
    .then((response)=>{
      res.send(response)
    }).catch((err)=>{res.send(err)})

},
 
deleteComment:(req,res)=>{
      
    db.review.destroy({where:{id:req.params.id}})
    .then((response)=>res.sendStatus(201))
   .catch((err)=>{res.json(err)})

  }

    
}