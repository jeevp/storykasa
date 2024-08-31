const mjml2html = require("mjml");

function promoCodeReminderEmailTemplate({
    userName,
    daysLeft,
    endDate
}) {
    const daysText = daysLeft === 1 ? '24 hours' : `${daysLeft} days`;

    const template = mjml2html(`
     <mjml>
      <mj-body background-color="#FFFCEF">
        <mj-section>
          <mj-column width="600px">
            <mj-text align="center" padding="20px" background-color="#FFFCEF">
              <img src="https://qqgpgejvlxdizhjkswmm.supabase.co/storage/v1/object/public/storykasa-logos/logo-black.png" alt="StoryKasa Logo" style="max-width: 150px;">
              <h1 style="font-family: 'Arial', sans-serif; color: #292524;">Promo Code Period Ending Soon!</h1>
            </mj-text>
    
            <mj-text align="center" padding="20px" background-color="#FFFCEF" font-family="'Arial', sans-serif" color="#292524" font-size="16px">
              <p style="line-height: 20px; color: #292524;">Hello ${userName},</p>
              <p style="line-height: 20px; color: #292524;">We wanted to remind you that your promo code period is ending in ${daysText}. The promo code will expire on ${endDate}.</p>
              <p style="line-height: 20px; color: #292524;">If you do not wish to continue with the current subscription and want to avoid being charged on your credit card, you can downgrade your subscription to the free plan in your account settings by this time.</p>
            </mj-text>
    
            <mj-button href="https://app.storykasa.com/account-settings" align="center" background-color="#3d996d" color="#FFFCEF" font-family="'Arial', sans-serif" font-size="16px" border-radius="5px" padding-bottom="40px">
              Manage Your Subscription
            </mj-button>
          </mj-column>
            <mj-column background-color="#3d996d" width="600px">
               
            <mj-text align="center" padding="20px"  font-family="'Lucida Sans', 'Lucida Sans Regular', Geneva, Verdana, sans-serif" color="#FFFCEF" font-size="12px">
              <p style="line-height: 20px;">If you have any questions, feel free to reach out to us.</p>
              <p style="line-height: 20px;">Happy Storytelling,<br>The StoryKasa Team</p>
            </mj-text>
            </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `);

    return template.html;
}

module.exports.default = promoCodeReminderEmailTemplate;
