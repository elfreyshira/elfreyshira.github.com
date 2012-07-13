{-# LANGUAGE TupleSections, OverloadedStrings #-}
module Handler.Events where

import Import
import Control.Monad(when,unless)
import Data.Maybe
import Data.Time

data EventFormData = EventFormData Text UTCTime

eventForm :: Form EventFormData
eventForm = renderDivs $ EventFormData
  <$> areq textField "Event Name" Nothing
  <*> liftA2 UTCTime 
             (areq dayField "Day" Nothing)
             (fmap timeOfDayToTime (areq timeField "Time" Nothing))

getEventListR :: Handler RepHtml
getEventListR = do
  requireAuth
  events <- runDB $ selectList [] [Asc EventTime]
  (widget,enctype) <- generateFormPost eventForm
  defaultLayout $(widgetFile "event-list")

postEventListR :: Handler RepHtml
postEventListR = do
  Entity userId user <- requireAuth
  ((res,_),enctype) <- runFormPost eventForm
  case res of
    FormSuccess (EventFormData title time) -> do
      let event = Event userId title time []
      eventId <- runDB $ insert event
      setMessage $ toHtml $ mconcat ["Your event ", eventName event, " has been successfully posted!"]
      redirect (EventR eventId)
    _ -> do
      setMessage $ toHtml ("That was not a valid form submission, sorry :( Try again?" :: String)
      redirect EventListR

employerWidget :: Entity Employer -> Widget 
employerWidget (Entity employerId employer) = setTitle "employer"

eventHeaders = ["Name","When","Where"]

eventRow :: Entity Event -> Widget
eventRow (Entity eventId (Event organizerId eventName time employerIds)) =
  -- employers' <- mapM (lift . runDB . get404) employerIds
  -- let employers = zipWith Entity employerIds employers'
  [whamlet|
    <td>
      <a href=@{EventR eventId}>#{eventName}
    <td>#{show time}
    <td>I dunno man
  |]

employerHeaders = ["Name","Primary Contact"]

employerEventRow (Entity eventId event) (Entity employerId employer) = do
  companyOwner <- lift $ runDB $ get404 $ employerCreator employer
  let descriptionPadding = toHtml $ concat $ replicate 10 ("this is description padding " :: String)
  $(widgetFile "event-row")

getEventR :: EventId -> Handler RepHtml
getEventR eventId = do
  Entity userId user <- requireAuth
  event <- runDB $ get404 eventId
  employerEntities <- mapM (runDB . get404) (eventEmployers event)
  let employers = zipWith Entity (eventEmployers event) employerEntities
      eventEntity = Entity eventId event
      ps = zip (repeat eventEntity) employers
      companyTable = makeTable' (uncurry employerEventRow) ps
      displayButton = (isJust . userCompany $ user) && notElem (fromJust $ userCompany user) (eventEmployers event)
  defaultLayout $(widgetFile "event")

postEventR :: EventId -> Handler RepHtml
postEventR eventId = do
  Entity userId user <- requireAuth 
  case userCompany user of
    Just companyId -> do
      event <- runDB $ get404 eventId
      let employers = eventEmployers event
      unless (elem companyId employers) $ do
        runDB $ replace eventId event{eventEmployers = companyId:employers}
        setMessage $ toHtml ("Company successfully added!" :: String)
      redirect $ EventR eventId
    Nothing -> redirect $ EventR eventId
