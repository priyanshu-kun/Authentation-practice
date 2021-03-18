"use strict"

/**
 * Get unique error field name
 */

const uniqueMessage = error => {
    let output;
    console.log(error)
    try {
        let fieldName = error.message.split('.$')[1]
        field = field.split(' dub key')[0]
        field = field.substring(0, field.lastIndexOf("_"))
        req.flash("errors", [{
            message: "An Account with this " + field + " already exists"
        }])
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " already exists";
    }
    catch (error) {
        output = " already exists"
    }
    return output;
}

exports.errorHandler = error => {
    let message = ""
    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Something went wrong"
        }
    }
    else {

    }
}