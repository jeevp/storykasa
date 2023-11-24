const mjml2html = require("mjml");
const { green600, neutral800 } = require("../../../../assets/colorPallet/colors");

function recoverPasswordEmailTemplate({
     userName,
 }) {
    const template = mjml2html(`
        <mjml>
            <mj-body>
                <mj-column align="center" background-color="#f4f4f4" padding="20px" width="100%">
                    <mj-column background-color="white" width="460px" align="center" border="1px solid #ddd">
                        <mj-section padding-bottom="0">
                            <mj-column align="center">
                                <mj-text align="center" font-size="16px" color=${neutral800}>
                                    Olá, <span style="font-weight: bold;">${userName}</span>
                                </mj-text>
                                <mj-text line-height="1.4em" align="center" font-size="16px" color=${neutral800}>
                                    Follow this link to reset your password
                                </mj-text>
                            </mj-column>
                        </mj-section>
                        <mj-section 
                        width="460px" 
                        height="60px"
                        padding-bottom="0"
                        background-color=${green600}>
                            <mj-column align="center" padding-bottom="20px">
                                <mj-image src="https://bit.ly/2PeZHon" width="120px" />
                            </mj-column>
                        </mj-section>
                    </mj-column>
                </mj-container>
            </mj-body>
        </mjml>
    `);

    return template.html;
}

module.exports.default = recoverPasswordEmailTemplate;
