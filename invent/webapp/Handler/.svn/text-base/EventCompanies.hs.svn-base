{-# LANGUAGE TupleSections, OverloadedStrings #-}
module Handler.EventCompanies where

import Import

data DisplayEmployer = DisplayEmployer 	{ displayEmployerName :: Text
                                        , displayEmployerRecruiters :: [Text]
                                        } deriving (Show)

getEventCompaniesR :: EventId -> Handler RepHtml
getEventCompaniesR eventId = do
    event <- runDB $ get404 eventId
    employers <- mapM (runDB . get404) (eventEmployers event)
    displayEmployers <- mapM displayEmployer employers
    defaultLayout $(widgetFile "company-list")

displayEmployer :: EmployerGeneric a -> Handler DisplayEmployer
displayEmployer employer = DisplayEmployer 
                            <$> return (employerName employer) 
                            <*> mapM (fmap userIdent . runDB . get404) (employerRecruiters employer)

postEventCompaniesR :: EventId -> Handler RepHtml
postEventCompaniesR _ = defaultLayout [whamlet|<h1>Not so fast|]
{-postEventCompaniesR eventId = do-}
  {-Entity userId user <- requireAuth-}
  {-((res,_),enctype) <- runFormPost employerForm-}
  {-case res of-}
    {-FormSuccess (EmployerFormData name) -> do-}
      {-let employer = Employer name userId []-}
      {-employerId <- runDB $ insert employer-}
      {-runDB $ update -}
      {-setMessage $ toHtml $ mconcat ["Your company ", employerName employer, " has been successfully added!"]-}
      {-redirect (EventCompanyR eventId employerId)-}
    {-_ -> do-}
      {-setMessage $ toHtml $ ("That was not a valid form submission, sorry :( Try again?" :: String)-}
      {-redirect (EventCompaniesR eventId)-}

getEventCompanyR :: EventId -> EmployerId -> Handler RepHtml
getEventCompanyR eventId employerId = do
    Entity userId user <- requireAuth
    employer <- runDB $ get404 employerId
    let companyName = employerName employer
    jobs <- runDB $ selectList [EventJobEvent ==. eventId, EventJobEmployer ==. employerId] []
    defaultLayout $(widgetFile "event-company")

eventCompanyRow :: Entity EventJob -> Widget
eventCompanyRow (Entity eventJobId (EventJob _ _ title url)) = 
    [whamlet|
        <td>#{title}
        <td>
            <a href=#{url}>Information
    |]
