import express from 'express';
import controller from '../controllers/Author';

const router = express.Router();

router.post('/create', controller.createAuthor);
router.get('/:authorId?', controller.readAuthor);
router.patch('/:authorId', controller.updateAuthor);
router.delete('/:authorId', controller.deleteAuthor);

export = router;
