const mjml2html = require("mjml");

function invitationEmailTemplate({
    userEmail,
    temporaryPassword
}) {
    const template = mjml2html(`
     <mjml>
      <mj-body background-color="#FFFCEF">
        <mj-section>
          <mj-column width="600px">
            <mj-text align="center" padding="20px" background-color="#FFFCEF">
              <img src="https://qqgpgejvlxdizhjkswmm.supabase.co/storage/v1/object/public/storykasa-logos/logo-black.png" alt="StoryKasa Logo" style="max-width: 150px;">
              <h1 style="font-family: 'Arial', sans-serif; color: #292524;">Welcome to StoryKasa!</h1>
            </mj-text>
    
            <mj-text align="center" padding="20px" background-color="#FFFCEF" font-family="'Arial', sans-serif" color="#292524" font-size="16px">
              <p style="line-height: 20px; color: #292524;">Hello,</p>
              <p style="line-height: 20px; color: #292524;">We're excited to have you join our storytelling community at StoryKasa.</p>
              <p style="line-height: 20px; color: #292524;">Here are your initial login credentials:</p>
              <p style="line-height: 20px; color: #292524;"><strong>Email:</strong> ${userEmail}</p>
              <p style="line-height: 20px; color: #292524;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>
              <p style="line-height: 20px; color: #292524;">To get started, click the link below to log in and explore the enchanting world of stories!</p>
            </mj-text>
    
            <mj-button href="https://app.storykasa.com/login" align="center" background-color="#3d996d" color="#FFFCEF" font-family="'Arial', sans-serif" font-size="16px" border-radius="5px" padding-bottom="40px">
              Log In to StoryKasa
            </mj-button>
          </mj-column>
            <mj-column background-color="#3d996d" width="600px">
               
            <mj-text align="center" padding="20px"  font-family="'Lucida Sans', 'Lucida Sans Regular', Geneva, Verdana, sans-serif" color="#FFFCEF" font-size="12px">
              <p style="line-height: 20px;">If you didn't request this invitation, please ignore this email.</p>
              <p style="line-height: 20px;">Happy Storytelling,<br>The StoryKasa Team</p>
            </mj-text>
            </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `);

    return template.html;
}

module.exports.default = invitationEmailTemplate;
