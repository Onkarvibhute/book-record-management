const { request, response } = require("express");
const express = require("express")
const { books } = require("../data/books.json")
const {users}= require("../data/users.json")
const router = express.Router()

/**
 * Routes:/books
 * method:GET
 * Description:Get all books
 * Access: Public
 * Parameters:None
 */

router.get("/", (request, response) =>
{
    response.status(200).json({
        success: "True",
        data: books
        
    });
});

/**
 * Routes:/books/:id
 * method:GET
 * Description:Get all books
 * Access: Public
 * Parameters:id
 */

router.get("/:id", (request, response) =>
{
    const { id } = request.params
    const book = books.find((each) => each.id === id)
    if (!book)
    {
        response.status(404).json({
            success: "false",
            message: `book with id ${id} is not present`
        })
    }
    return response.status(200).json({
        success: "True",
        data: book
    });
    
});

/**
 * Routes:/books/:id
 * method:POST
 * Description:Create a new user
 * Access: Public
 * Parameters:id
 */
router.post("/", (request, response) =>
{
    const { bookid, bookname, bookauthor, bookgenre, bookprice, bookpublisher } = request.body
    const book = books.find((each) => each.id === bookid)
    if (book)
    {
        return response.status(404).json({
            success: "false",
            message: `book with id ${bookid} is already present`
            

        })
    }
    books.push({
        bookid, bookname, bookauthor, bookgenre, bookprice, bookpublisher
    })
    return response.status(201).json({
        success: "true",
        data: books
    })
});

/**
 * Routes:/books/:id
 * method:PUT
 * Description:updating user data
 * Access: Public
 * Parameters:id
 */

router.put("/:id", (request, response) =>
{
    const { id } = request.params
    const { data } = request.body
    const book = books.find((each) => each.id === id)
    
    if (!book)
    {
        return response.status(404).json({
            success: "false",
            message: `book with id ${id} is not present`
        })
    }
    
    const updatebookDetails = books.map((each) =>
    {
        if (each.id === id)
        {
            return {
                ...each,
                ...data
            }
        }
        return {
            ...each
        }
    })

    return response.status(200).json({
        success: "true",
        data:updatebookDetails

    });
});

/**
 * Routes:/books/:id
 * method:PUT
 * Description:updating user data
 * Access: Public
 * Parameters:id
 */

router.delete("/:id", (request, response) =>
{
    const { id } = request.params
    const book = books.find((each) => each.id === id)
    if (!book)
    {
        return response.status(404).json({
            success: "false",
            message: `book with id ${id} is not found`
            
        })
    }
    const deletebook = books.indexOf(book)
    books.splice(deletebook, 1)
    return response.status(202).json({
        success: "true",
        data:books
    })
})

/** 
 * Routes:/books/issued/byuser
 * method:GET
 * Description:Get all issued books
 * Access: Public
 * Parameters:none
 */
router.get("/issued/byuser", (request, response) =>
{
    const userswithissuedbooks = users.filter((each) =>
    {
        if (each.issuedBook)
        {
            return each
        }
    });
    const issuedbooks = []
    
    userswithissuedbooks.forEach((each) =>
    {
        const book = books.find((book) => book.id === each.issuedBook)
        
        book.issuedBy = each.name
        book.issuedDate = each.issuedDate
        book.returnDate = each.returnDate
        issuedbooks.push(book)
    })

    if (issuedbooks.length === 0){
        return response.status(404).json({
            success: "false",
            message: "no book is issued yet "
        })
        }
    return response.status(200).json({
        success: "true",
        data:issuedbooks
        
    })
});



module.exports = router;
