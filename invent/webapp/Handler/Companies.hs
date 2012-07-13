{-# LANGUAGE TupleSections, OverloadedStrings #-}
module Handler.Companies where

import Import

data EmployerFormData = EmployerFormData {
                          name :: Text,
                          description :: Text
                        }

employerForm :: Form EmployerFormData
employerForm = renderDivs $ EmployerFormData
  <$> areq textField "Company Name" Nothing
  <*> areq textField "Company Description" Nothing

getCompaniesR :: Handler RepHtml
getCompaniesR = do
    employers <- runDB $ selectList [] [Asc EmployerName] 
    (widget,enctype) <- generateFormPost employerForm
    let employerHeaders = ["Company Name", "Description"]
    defaultLayout $(widgetFile "company")

employerRow :: Entity Employer -> Widget
employerRow (Entity employerId (Employer name description creator recruiters jobs)) = 
    [whamlet|
    <td>#{name}
    <td>#{description}
            |]

postCompaniesR :: Handler RepHtml
postCompaniesR = do
  Entity userId user <- requireAuth
  ((res,_),enctype) <- runFormPost employerForm
  case res of
    FormSuccess (EmployerFormData name desc) -> do
      let employer = Employer name desc userId [] []
      employerId <- runDB $ insert employer
      runDB $ replace userId user{userCompany=Just employerId}
      setMessage $ toHtml $ mconcat ["Your company ", employerName employer, " has been successfully created!"]
      redirect CompaniesR
    _ -> do
      setMessage $ toHtml ("That was not a valid form submission, sorry :( Try again?" :: String)
      redirect CompaniesR
