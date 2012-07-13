{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
module Handler.Mobile where

import Import
import qualified Data.ByteString.Lazy as L
import Network.Wai
import Data.Conduit.Lazy (lazyConsume)
import Data.Aeson.Parser (json)
import Data.Attoparsec.ByteString.Lazy

import Data.Aeson 
import Control.Monad (mzero, void)
import qualified Data.Vector as V

import Data.Maybe (isJust, fromJust)

getCriterionR :: EventId -> Handler RepJson
getCriterionR eventId = do
  Entity userId user <- requireAuth
  lcriteria <- runDB $ selectList [UserEventEvent ==. eventId, UserEventUser ==. userId] [LimitTo 1]
  case lcriteria of
    [] -> jsonToRepJson ([] :: [Text])
    [Entity criteriaId (UserEvent _ _ criteriaIds)] -> do
      criteria' <- mapM (runDB . get404) criteriaIds
      let criteria = map criterionText criteria' 
      jsonToRepJson (criteria :: [Text])

postCriterionR :: EventId -> Handler ()
postCriterionR eventId = do
  Entity userId user <- requireAuth
  mts <- parseJsonFromBody
  case mts of 
    Nothing -> notFound
    Just (ts :: [Text]) -> do
      criterionIds <- mapM (runDB . insert . Criterion) ts
      void $ runDB $ deleteWhere [UserEventUser ==. userId]
      void $ runDB $ insert (UserEvent userId eventId criterionIds)

-- parseJsonFromBody :: FromJson a => Handler (Maybe a)
parseJsonFromBody = do
  wr <- waiRequest
  bss <- lift $ lazyConsume $ requestBody wr
  liftIO $ print $ L.fromChunks bss
  let result = parse json $ L.fromChunks bss
  case result of 
    Done _ (value :: Value) -> do
      liftIO $ print value
      case fromJSON value of
        Success t -> do
          return $ Just t
        _ -> return Nothing
    _ -> return Nothing

getEditCriterionR :: EventId -> Handler RepHtml
getEditCriterionR eventId = do
  Entity userId user <- requireAuth
  if isJust $ userCompany $ user
    then redirect (StaticR webpages_codiqa_app_empConfQuickReview_html)
    else redirect (StaticR webpages_codiqa_app_studConfQuickReview_html)

authStatic x = do
  void requireAuth
  redirect (StaticR x)

getELandingPageR, getJLandingPageR :: EventId -> Handler RepHtml
getELandingPageR eventId = authStatic webpages_codiqa_app_empActSel_html
getJLandingPageR eventId = authStatic webpages_codiqa_app_studActSel_html

getMyAccountIdR :: Handler RepJson
getMyAccountIdR = do
  Entity userId user <- requireAuth
  jsonToRepJson userId

getBumpR :: UserId -> Handler RepHtml
getBumpR jobseekerId = do
  Entity recruiterId recruiter <- requireAuth
  void $ runDB $ insert (Contact jobseekerId recruiterId)
  void $ runDB $ insert (UnhandledContact jobseekerId recruiterId)
  redirect (StaticR webpages_button_html)

getPollR :: EventId -> Handler RepHtml
getPollR eventId = do
  Entity userId user <- requireAuth
  unhandled <- runDB $ selectList [UnhandledContactJobseeker ==. userId] [LimitTo 1]
  case unhandled of
    [] -> do
      defaultLayout $ do
        toWidget [julius|setTimeout("location.reload(true)",5000);|] 
        let qrCodeUrl = "http://labkit.indeed.com/qrme?url=" ++ show userId
        [whamlet|<img src=#{qrCodeUrl}>|]
    ((Entity ucId (UnhandledContact _ recId)):_) -> do
      recruiter <- runDB $ get404 recId
      runDB $ delete ucId
      redirect (RateEmployerR eventId (fromJust $ userCompany $ recruiter))

getRateJobseekerR,postRateJobseekerR :: EventId -> UserId -> Handler RepHtml
getRateEmployerR,postRateEmployerR :: EventId -> EmployerId -> Handler RepHtml
getRateJobseekerR eventId jobseekerId = undefined -- authStatic webpages_codiqa_app_studAct_html
postRateJobseekerR eventId jobseekerId = undefined
getRateEmployerR eventId employerId = undefined -- authStatic webpages_codiqa_app_empAct_html
postRateEmployerR eventId employerId = undefined
