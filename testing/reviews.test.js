// Mock the `pool.query` method
/*jest.mock('../helpers/db.js', () => ({
    pool: {
      query: jest.fn(),
    },
  }));*/
  
  describe('Controller Methods', () => {
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('postNewReview', () => {
      it('should return 400 if required fields are missing', async () => {
        const req = { body: { rating: '', comment: '' } };
        const res = mockResponse();
  
        await postNewReview(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('newReview is required');
      });
  
      it('should insert a new review and return 201', async () => {
        const req = { body: { movieId: 1, accountId: 1, email: 'test@example.com', rating: 5, comment: 'Great!' } };
        const res = mockResponse();
        const mockInsertedReview = { rows: [{ id: 1, movie_id: 1 }] };
  
        insertReview.mockResolvedValue(mockInsertedReview);
  
        await postNewReview(req, res);
        expect(insertReview).toHaveBeenCalledWith(1, 1, 'test@example.com', 5, 'Great!');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockInsertedReview);
      });
    });
  
    describe('getReviewsByMovie', () => {
      it('should return reviews for a specific movie', async () => {
        const req = { params: { movieId: 1 } };
        const res = mockResponse();
        const mockReviews = { rows: [{ id: 1, comment: 'Awesome!' }] };
  
        selectReviewsByMovie.mockResolvedValue(mockReviews);
  
        await getReviewsByMovie(req, res);
        expect(selectReviewsByMovie).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockReviews.rows);
      });
    });
  
    describe('postFavorite', () => {
      it('should add a movie to favorites', async () => {
        const req = { body: { accountId: 1, movieId: 2, favorite: true } };
        const res = mockResponse();
        const mockFavorite = { rows: [{ id: 1, movie_id: 2 }] };
  
        insertFavorite.mockResolvedValue(mockFavorite);
  
        await postFavorite(req, res);
        expect(insertFavorite).toHaveBeenCalledWith(1, 2);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Movie added to favorites',
          data: mockFavorite.rows[0],
        });
      });
  
      it('should remove a movie from favorites', async () => {
        const req = { body: { accountId: 1, movieId: 2, favorite: false } };
        const res = mockResponse();
        const mockDeleted = { rows: [{ id: 1, movie_id: 2 }] };
  
        deleteFavorite.mockResolvedValue(mockDeleted);
  
        await postFavorite(req, res);
        expect(deleteFavorite).toHaveBeenCalledWith(1, 2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          success: true,
          message: 'Movie removed from favorites',
        });
      });
    });
  
    describe('getFavoriteStatus', () => {
      it('should return favorite status of a movie', async () => {
        const req = { params: { accountId: 1, movieId: 2 } };
        const res = mockResponse();
        const mockStatus = { rows: [{ id: 1, movie_id: 2 }] };
  
        checkFavorite.mockResolvedValue(mockStatus);
  
        await getFavoriteStatus(req, res);
        expect(checkFavorite).toHaveBeenCalledWith(1, 2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ isFavorite: true });
      });
    });
  
    describe('getFavoritesByUser', () => {
      it('should return all favorite movies for a user', async () => {
        const req = { params: { accountId: 1 } };
        const res = mockResponse();
        const mockFavorites = { rows: [{ id: 1, movie_id: 2 }] };
  
        selectFavoritesByUser.mockResolvedValue(mockFavorites);
  
        await getFavoritesByUser(req, res);
        expect(selectFavoritesByUser).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockFavorites.rows);
      });
    });
  });
  