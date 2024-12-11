import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
const {sign} = jwt
import multer from 'multer';
import { insertUser, selectUserByEmail,deleteUserById,selectReviewsByUser,createShareUrl,selectShareInfoByUser,selectShareInfoByUrl,toggleShareVisibility,selectFavoritesByUser,selectAllPublicShares,selectUserById,selectAccountAvatarById,updateUserAvatar,updateAccountInfo
  ,addMovieToWatchlist,
  getWatchlistByStatus,
  updateMovieStatus,
  removeMovieFromWatchlist
} from '../models/User.js'
import { ApiError } from '../helpers/ApiError.js'
import dotenv from 'dotenv';

dotenv.config()


//watchlist
const addMovie = async (req, res, next) => {
  const { accountId, movieId, status } = req.body;

  try {
    console.log('Adding movie to watchlist', { accountId, movieId, status });

    if (!accountId || !movieId || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await addMovieToWatchlist(accountId, movieId, status);
    res.status(201).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    console.error('Error adding movie to watchlist:', err);
    res.status(500).json({ message: 'Failed to add movie to watchlist' });
    next(err); 
  }
};

const getMoviesByStatus = async (req, res, next) => {
  const { accountId, status } = req.params;

  try {
    const movies = await getWatchlistByStatus(accountId, status);
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
};

const updateMovie = async (req, res, next) => {
    const { accountId, movieId } = req.params;
    const { status } = req.body;


  try {
    await updateMovieStatus(accountId, movieId, status);
    res.status(200).json({ message: 'Movie status updated' });
  } catch (err) {
    next(err);
  }
};

const removeMovie = async (req, res, next) => {
  const { accountId, movieId } = req.params;

  try {
    await removeMovieFromWatchlist(accountId, movieId);
    res.status(200).json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    next(err);
  }
};


const postRegistration = async(req,res,next) => {
  try{
    if (!req.body.username || req.body.username.length ===0 ) return next (new ApiError('Invalid name for user',400))
    if (!req.body.email || req.body.email.length ===0 ) return next (new ApiError('Invalid email for user',400))
    if (!req.body.password || req.body.password.length <8) return next(new ApiError('Invalid password for user',400))

    const hashedPassword = await hash(req.body.password,10)
    const userFromDb = await insertUser(req.body.username,req.body.email,hashedPassword)
    const user = userFromDb.rows[0]
    
    return res.status(201).json(createUserObject(user.id, user.username, user.email));
  } catch (error) {
    return next(error);
  }
};

const createUserObject = (id,username,email,token=undefined) => {
  return {
    'id': id,
    'username': username,
    'email': email,
    ...(token !== undefined) && {'token':token}
  }
}

const postLogin = async(req,res,next) => {
  const invalid_credentials_message = 'Invalid credentials.'
  try {
    const userFromDb = await selectUserByEmail(req.body.email)
    if (userFromDb.rowCount === 0) return next(new ApiError(invalid_credentials_message))
    
    const user = userFromDb.rows[0]  
    if (!await compare(req.body.password,user.password)) return next(new ApiError(invalid_credentials_message))

    const token = sign(req.body.email,process.env.JWT_SECRET_KEY)    
    return res.status(200).json(createUserObject(user.id,user.username,user.email,token)) 
  } catch (error) {
    return next(error)
  }
}

const signOut = (req, res) => {
  try {
      console.log('User logged out successfully.');

      res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout failed', error: error.message });
  }
}

const deleteUser = async (req, res, next) => {
  try {
    if (!req.body.id) return next(new ApiError('Invalid ID provided for deletion', 400));

    const userFromDb = await deleteUserById(req.body.id);
    if (userFromDb.rowCount === 0)
      return next(new ApiError('User not found or already deleted', 404));

    return res.status(200).json({ message: 'User account successfully deleted' });
  } catch (error) {
    return next(error);
  }
};


const getAccountInfo = async(req, res, next)=>{
  const { accountId } = req.params;
  try {
    const result = await selectUserById(accountId);
    res.status(200).json(result.rows);  
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
}

const editAccountInfo = async (req, res,next) => {
  const { accountId } = req.params;
  const { username,country,gender,birthday } = req.body;

  try {
    // update the group details
    await updateAccountInfo(username,country,gender,birthday,accountId);

    res.status(200).json({ message: 'Account details updated successfully' });
  } catch (error) {
    console.error('Error updating account details:', error);
    next(error);
  }
};

//store
const upload = multer({ storage: multer.memoryStorage() });
// Upload group image
const uploadUserAvatar = async (req, res) => {
  const { accountId } = req.params;
  const fileBuffer = req.file.buffer; 

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    await updateUserAvatar(fileBuffer, accountId)
    const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    res.status(200).json(base64Image);
  } catch (error) {
    console.error('Error updating user avatar:', error);
    res.status(500).json({ error: 'Failed to update user avatar' });
  }
};

const getUserAvart = async (req, res) => {
  const { accountId } = req.params;

  try {
    const result = await selectAccountAvatarById(accountId);
    if (result.rows.length > 0 && result.rows[0].avatar) {
      const imageBuffer = result.rows[0].avatar;
      const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      res.status(200).json({ base64Image });
    } else {
      res.status(404).send('Image not found.');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Failed to fetch image.');
  }
};

const getReviewsByUser = async (req, res, next) => {
  const { accountId } = req.params;
  try {
    const result = await selectReviewsByUser(accountId);
    res.status(200).json(result.rows);  
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
};

const getShareInfo = async (req, res,next) => {
  const { accountId } = req.params;

  try {
    const result = await selectShareInfoByUser(accountId);
  
    // if no url, generate url, then get share_url, is_public
    if (!result.rows[0].share_url) {
    const generateResult = await createShareUrl(accountId);
    result.rows[0].share_url=generateResult.rows[0].share_url
    res.status(200).json(result.rows[0])
    }

    //if url, get share_url, is_public directly
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching or generating share info:', error);
    next(error); 
  }
};

// seperate test:
/*const postNewShareUrl = async (req, res) => {
  const { accountId } = req.params;

  try {
    const newShareUrl = await generateShareUrl(accountId);
    res.status(201).json({ shareUrl: newShareUrl });
  } catch (error) {
    console.error('Error generating new share URL:', error);
    res.status(500).json({ error: 'Failed to generate share URL' });
  }
};

const getShareUrl = async (req, res) => {
  const { accountId } = req.params;

  try {
    const result = await selectShareInfoByUser(accountId);
    const { share_url: shareUrl, is_public: isPublic } = result;

    if (!shareUrl) {
      return res.status(404).json({ error: 'No share URL found. Consider generating one.' });
    }

    res.status(200).json({ shareUrl, isPublic });
  } catch (error) {
    console.error('Error fetching share URL:', error);
    res.status(500).json({ error: 'Failed to fetch share URL' });
  }
};*/

const putShareVisibility = async (req, res) => {
  const { accountId } = req.params;
  const { isPublic } = req.body; 

  try {
    await toggleShareVisibility(accountId, isPublic);
    res.status(200).json({ message: `Share visibility updated to ${isPublic ? 'public' : 'private'}` });
  } catch (error) {
    console.error('Error updating share visibility:', error);
    res.status(500).json({ error: 'Failed to update share visibility' });
  }
};

const getFavoritesByShareUrl = async (req, res) => {
  const { shareUrl } = req.params;

  try {
    const userResult = await selectShareInfoByUrl(shareUrl);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'Share URL not found' });
    }

    const user = userResult.rows[0];

    // check public
    if (!user.is_public) {
      return res.status(403).json({ error: 'This profile is private' });
    }

    // get favorite list
    const favoritesResult = await selectFavoritesByUser(user.id);
    res.status(200).json({ accountId: user.id, email: user.email, favorites: favoritesResult.rows });
  } catch (error) {
    console.error('Error fetching favorites by share URL:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};


const getAllPublicShares = async (req, res) => {
  try {
    const publicShares = await selectAllPublicShares(); 
    res.status(200).json(publicShares);
  } catch (error) {
    console.error('Error fetching public shares:', error);
    res.status(500).json({ error: 'Failed to fetch public shares' });
  }
};


export {postRegistration, postLogin, deleteUser, signOut, getReviewsByUser,getShareInfo,putShareVisibility,getFavoritesByShareUrl,getAllPublicShares,getAccountInfo,getUserAvart,uploadUserAvatar,upload,editAccountInfo,
  addMovie, getMoviesByStatus,updateMovie,removeMovie
}