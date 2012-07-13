{-# LANGUAGE TupleSections, OverloadedStrings #-}
module Handler.Dashboard where

import Import
import Data.Maybe (isJust, catMaybes, mapMaybe, fromMaybe)

getEventDashboardR :: EventId -> Handler RepHtml
getEventDashboardR eventId = do
  Entity userId user <- requireAuth
  if not . isJust $ userCompany user
    then getJobseekerDashboard eventId
    else getEmployerDashboard eventId

jobseekerDashboardRow :: Entity Event -> Entity Employer -> Widget
jobseekerDashboardRow (Entity eventId event) (Entity employerId employer) = do
  companyOwner <- lift $ runDB $ get404 $ employerCreator employer
  let descriptionPadding = toHtml $ concat $ replicate 10 ("this is description padding " :: String)
  $(widgetFile "jobseeker-dashboard-row")
  
getJobseekerDashboard :: EventId -> Handler RepHtml
getJobseekerDashboard eventId = do
  Entity userId user <- requireAuth
  event <- runDB $ get404 eventId
  contactEntities <- runDB $ selectList [ContactJobseeker ==. userId] []
  recruiters <- mapM (runDB . get404 . contactRecruiter . (\(Entity _ contact) -> contact)) contactEntities
  let companyIds = mapMaybe userCompany recruiters
  companies' <- mapM (runDB . get404) companyIds
  let companies = zipWith Entity companyIds companies'
      companyTable = makeTable' (uncurry jobseekerDashboardRow) (zip (repeat $ Entity eventId event) companies)
  defaultLayout $(widgetFile "jobseeker-dashboard")

employerDashboardRow :: Entity Rating -> Widget
employerDashboardRow (Entity ratingId (Rating rater (Just ratedUser) ratedEmployer criteria values)) = do
    ratedUserEntity <- lift $ runDB $ get404 $ ratedUser
    criteriaEntities <- lift $ mapM (runDB . get404) criteria
    let cv = zip (fmap criterionText criteriaEntities) values
    [whamlet|
        <td>#{userIdent ratedUserEntity}
        <td>Resume link
        <td>#{show cv}
    |]

getEmployerDashboard :: EventId -> Handler RepHtml
getEmployerDashboard eventId = do
  Entity userId user <- requireAuth
  event <- runDB $ get404 eventId
  contactEntities <- runDB $ selectList [ContactRecruiter ==. userId] []
  let jobseekerIds = fmap (\(Entity _ contact) -> contactJobseeker contact) contactEntities
  allRatingEntities <- runDB $ selectList [RatingRater ==. userId] []
  let jobseekerTable = makeTable' employerDashboardRow allRatingEntities
  defaultLayout $(widgetFile "employer-dashboard")
