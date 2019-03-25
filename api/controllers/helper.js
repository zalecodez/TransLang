'use strict';

//function which sends 400 on error and 200 on success
exports.sendResponse = function(res, err, successMessage, obj){
    if(err){
        return exports.send400(res, err);
    }
    return exports.send200(res, successMessage, obj);
};

exports.send404 = function(res, err){
    return res.status(404).send({
        success: 'false',
        message: err
    });
};


exports.send400 = function(res, err){
    return res.status(400).send({
        success: 'false',
        message: err
    });
};

exports.send204 = function(res, message){
    return res.status(204).send();
};

exports.send201 = function(res, message, obj){
    return res.status(201).send({
        success: 'true',
        message: message,
        obj
    });
};

exports.send200 = function(res, message, obj){
    return res.status(200).send({
        success: 'true',
        message: message,
        obj
    });
};

