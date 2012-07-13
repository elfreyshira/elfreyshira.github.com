{-# LANGUAGE TupleSections, OverloadedStrings #-}
module Handler.My where

import Import

data JobFormData = JobFormData 	{ title :: Text
                                , url :: Text
                                }


jobForm :: Form JobFormData
jobForm = renderDivs $ JobFormData
    <$> areq textField "Job Title" Nothing
    <*> areq textField "Indeed link" Nothing

getMyCompanyR :: Handler RepHtml
getMyCompanyR = do
    Entity userId user <- requireAuth
    case userCompany user of
        Nothing -> redirect CompaniesR
        Just employerId -> do
            employer <- runDB $ get404 employerId
            let companyName = employerName employer
            jobs <- runDB $ selectList (fmap (JobId==.) (employerJobs employer)) []
            (widget,enctype) <- generateFormPost jobForm
            defaultLayout $(widgetFile "my-company")

jobRows :: Entity Job -> Widget
jobRows (Entity jobId (Job employerId title url)) = 
    [whamlet|
        <td>#{title}
        <td>
            <a href=#{url}>Information
    |]

postMyCompanyR :: Handler RepHtml
postMyCompanyR = do
    Entity userId user <- requireAuth
    case userCompany user of
        Nothing -> redirect CompaniesR
        Just employerId -> do
            ((res,_),enctype) <- runFormPost jobForm
            case res of
                FormSuccess (JobFormData title url) -> do
                    let job = Job employerId title url
                    runDB $ insert job
                    redirect MyCompanyR

