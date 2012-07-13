{-# LANGUAGE TupleSections, OverloadedStrings #-}
module Handler.Jobseeker where

import Import

getJobseekerR :: UserId -> Handler RepHtml
getJobseekerR userId = do
  user <- runDB $ get404 userId 
  case userResume user of
    Just resumeUrl -> do
      let escaped = toHtml resumeUrl
      defaultLayout $ [whamlet|
        <iframe width=100% height=1680 src=#{resumeUrl}>
        |] 
    Nothing -> notFound
