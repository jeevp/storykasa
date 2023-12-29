const mjml2html = require("mjml");

function invitationEmailTemplate({
    collectionTitle,
    collectionOwnerName
}) {
    const template = mjml2html(`
     <mjml>
      <mj-body background-color="#FFFCEF">
        <mj-section>
          <mj-column width="600px">
            <mj-text align="center" padding="20px" background-color="#FFFCEF">
              <img src="https://qqgpgejvlxdizhjkswmm.supabase.co/storage/v1/object/public/storykasa-logos/logo-black.png" alt="StoryKasa Logo" style="max-width: 150px;">
              <h1 style="font-family: 'Arial', sans-serif; color: #292524;">You're Invited to '${collectionTitle}' on StoryKasa!</h1>
            </mj-text>
    
            <mj-text align="center" padding="20px" background-color="#FFFCEF" font-family="'Arial', sans-serif" color="#292524" font-size="16px">
              <p style="line-height: 20px; color: #292524;">Hello,</p>
              <p style="line-height: 20px; color: #292524;"><span style="font-weight: 600;">${collectionOwnerName}</span> has invited you to join the collection, '${collectionTitle},' on StoryKasa. Whether you're already part of our storytelling family or new to our community, this collection promises a journey through imagination and wonder.</p>
              <p style="line-height: 20px; color: #292524;">As a listener, you'll experience a rich world of stories, shared by friends and family. If you're not yet a StoryKasa user, no worries! Join us easily and start enjoying ${collectionOwnerName}'s tales right away.</p>
              <p style="line-height: 20px; color: #292524;">Ready to explore? Click the link below to accept ${collectionOwnerName}'s invitation and dive into the enchanting world of stories!</p>
            </mj-text>
    
            <mj-button href="https://app.storykasa.com/collections" align="center" background-color="#3d996d" color="#FFFCEF" font-family="'Arial', sans-serif" font-size="16px" href="https://app-link.com" border-radius="5px" padding-bottom="40px">
              Join collection
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
