import { Request, Response, NextFunction } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import Joi from 'joi';
import { Validate } from '../decorators/validate';
import { createResource, getResources, updateResource, deleteResource, getResourceById } from '../database/db.service';

interface Resource {
    id?: number;
    name: string;
    email?: string;
}

const postResourceValidation = Joi.object<Resource>({
    name: Joi.string().required(),
    email: Joi.string().email()
});

const putResourceValidation = Joi.object<Resource>({
    name: Joi.string().required(),
    email: Joi.string().email().required()
});

const patchResourceValidation = Joi.object<Resource>({
    name: Joi.string(),
    email: Joi.string().email()
});

@Controller()
class MainController {
    @Route('get', '/healthcheck')
    getHealthCheck(req: Request, res: Response, next: NextFunction) {
        console.log('Healthcheck called successfully!');
        return res.status(200).json({ hello: 'world!' });
    }

    @Route('post', '/healthcheck')
    @Validate(postResourceValidation)
    postHealthCheck(req: Request, res: Response, next: NextFunction) {
        console.log('Healthcheck called successfully!');
        return res.status(200).json({ ...req.body });
    }

    @Route('get', '/resource')
    getResourceController(req: Request, res: Response, next: NextFunction) {
        console.log('Resource called successfully!');
        return getResources(req, res);
    }

    @Route('get', '/resource/:id')
    getResourceByIdController(req: Request, res: Response, next: NextFunction) {
        console.log('Resource details called successfully!');
        return getResourceById(req, res);
    }

    @Route('post', '/resource')
    @Validate(postResourceValidation)
    createResourceController(req: Request, res: Response, next: NextFunction) {
        console.log('Resource creation called successfully!');
        return createResource(req, res);
    }

    @Route('put', '/resource/:id')
    @Validate(putResourceValidation)
    updateResourceController(req: Request, res: Response, next: NextFunction) {
        console.log('Resource update called successfully!');
        return updateResource(req, res);
    }

    @Route('patch', '/resource/:id')
    @Validate(patchResourceValidation)
    patchResourceController(req: Request, res: Response, next: NextFunction) {
        console.log('Resource patch called successfully!');
        return updateResource(req, res);
    }

    @Route('delete', '/resource/:id')
    deleteResourceController(req: Request, res: Response, next: NextFunction) {
        console.log('Resource deletion called successfully!');
        return deleteResource(req, res);
    }
}

export default MainController;
