//import { insertReview, selectReviewsByMovie, selectAllReviews } from '../models/Movie.js';
//import { pool } from '../helpers/db.js';

jest.mock('../helpers/db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Movie Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('insertReview', () => {
        it('should insert a review and return the inserted review', async () => {
            const mockReview = {
                rows: [{
                    movie_id: 1,
                    account_id: 1,
                    email: 'test@example.com',
                    rating: 5,
                    comment: 'Great movie!',
                    time: new Date().toISOString(),
                }],
            };
            pool.query.mockResolvedValue(mockReview);

            const result = await insertReview(1, 1, 'test@example.com', 5, 'Great movie!');
            expect(pool.query).toHaveBeenCalledWith(
                "INSERT INTO reviews (movie_id, account_id, email, rating, comment, time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [1, 1, 'test@example.com', 5, 'Great movie!', expect.any(String)]
            );
            expect(result).toEqual(mockReview);
        });
    });

    describe('selectReviewsByMovie', () => {
        it('should select reviews by movie and return them', async () => {
            const mockReviews = {
                rows: [
                    { movie_id: 1, account_id: 1, email: 'test@example.com', rating: 5, comment: 'Great movie!', time: new Date().toISOString() },
                ],
            };
            pool.query.mockResolvedValue(mockReviews);

            const result = await selectReviewsByMovie(1);
            expect(pool.query).toHaveBeenCalledWith('select * from reviews where movie_id=$1 order by time DESC', [1]);
            expect(result).toEqual(mockReviews);
        });
    });

    describe('selectAllReviews', () => {
        it('should select all reviews and return them', async () => {
            const mockReviews = {
                rows: [
                    { movie_id: 1, account_id: 1, email: 'test@example.com', rating: 5, comment: 'Great movie!', time: new Date().toISOString() },
                ],
            };
            pool.query.mockResolvedValue(mockReviews);

            const result = await selectAllReviews();
            expect(pool.query).toHaveBeenCalledWith('select * from reviews');
            expect(result).toEqual(mockReviews);
        });
    });
});