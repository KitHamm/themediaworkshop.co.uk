import { emailHead } from "./baseTemplates/head";

const newMessageEmailTemplate = (name: string) => {
	return `
     <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    ${emailHead}
    <body class="t0" style="
            min-width: 100%;
            margin: 0px;
            padding: 0px;
            background-color: #f4f4f4;
        ">
    <div class="t1" style="background-color: #f4f4f4">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
            <tr>
                <td class="t2" style="
                            font-size: 0;
                            line-height: 0;
                            mso-line-height-rule: exactly;
                            background-color: #f4f4f4;
                        " valign="top" align="center">
                    <!--[if mso]>
                            <v:background
                                xmlns:v="urn:schemas-microsoft-com:vml"
                                fill="true"
                                stroke="false">
                                <v:fill color="#F4F4F4" />
                            </v:background>
                        <![endif]-->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"
                        id="innerTable">
                        <tr>
                            <td>
                                <div class="t3" style="
                                            mso-line-height-rule: exactly;
                                            font-size: 1px;
                                            display: none;
                                        ">
                                    &nbsp;
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table class="t10" role="presentation" cellpadding="0" cellspacing="0" align="center">
                                    <tr>
                                        <!--[if !mso]><!-->
                                        <td class="t11" style="
                                                    background-color: #000000;
                                                    width: 400px;
                                                    padding: 40px 40px 40px 40px;
                                                ">
                                            <!--<![endif]-->
                                            <!--[if mso]><td class="t11" style="background-color:#000000;width:480px;padding:40px 40px 40px 40px;"><![endif]-->
                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td>
                                                        <table class="t14" role="presentation" cellpadding="0"
                                                            cellspacing="0" align="left">
                                                            <tr>
                                                                <!--[if !mso]><!-->
                                                                <td class="t15" style="
                                                                            width: 370px;
                                                                            padding: 0
                                                                                15px
                                                                                0
                                                                                0;
                                                                        ">
                                                                    <!--<![endif]-->
                                                                    <!--[if mso]><td class="t15" style="width:385px;padding:0 15px 0 0;"><![endif]-->
                                                                    <div style="
                                                                                font-size: 0px;
                                                                            ">
                                                                        <img class="t21" style="
                                                                                    display: block;
                                                                                    border: 0;
                                                                                    height: auto;
                                                                                    width: 100%;
                                                                                    margin: 0;
                                                                                    max-width: 100%;
                                                                                " width="370" height="29.28125" alt=""
                                                                            src="https://uploads.tabular.email/e/d7da6daa-2d54-4310-a95f-0185f4a8e2e1/f0e8a285-ccfd-4cef-a3f6-f416cf5be5fe.png" />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="t13" style="
                                                                    mso-line-height-rule: exactly;
                                                                    mso-line-height-alt: 42px;
                                                                    line-height: 42px;
                                                                    font-size: 1px;
                                                                    display: block;
                                                                ">
                                                            &nbsp;
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <table class="t24" role="presentation" cellpadding="0"
                                                            cellspacing="0" align="center">
                                                            <tr>
                                                                <!--[if !mso]><!-->
                                                                <td class="t25" style="
                                                                            width: 480px;
                                                                        ">
                                                                    <!--<![endif]-->
                                                                    <!--[if mso]><td class="t25" style="width:480px;"><![endif]-->
                                                                    <h1 class="t31" style="
                                                                                margin: 0;
                                                                                margin: 0;
                                                                                font-family: BlinkMacSystemFont,
                                                                                    Segoe
                                                                                        UI,
                                                                                    Helvetica
                                                                                        Neue,
                                                                                    Arial,
                                                                                    sans-serif,
                                                                                    'Lato';
                                                                                line-height: 41px;
                                                                                font-weight: 800;
                                                                                font-style: normal;
                                                                                font-size: 39px;
                                                                                text-decoration: none;
                                                                                text-transform: none;
                                                                                letter-spacing: -1.56px;
                                                                                direction: ltr;
                                                                                color: #ffffff;
                                                                                text-align: left;
                                                                                mso-line-height-rule: exactly;
                                                                                mso-text-raise: 1px;
                                                                            ">
                                                                        You
                                                                        received
                                                                        a
                                                                        new
                                                                        message.
                                                                    </h1>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="t23" style="
                                                                    mso-line-height-rule: exactly;
                                                                    mso-line-height-alt: 16px;
                                                                    line-height: 16px;
                                                                    font-size: 1px;
                                                                    display: block;
                                                                ">
                                                            &nbsp;
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <table class="t56" role="presentation" cellpadding="0"
                                                            cellspacing="0" align="center">
                                                            <tr>
                                                                <!--[if !mso]><!-->
                                                                <td class="t57" style="
                                                                            width: 480px;
                                                                        ">
                                                                    <!--<![endif]-->
                                                                    <!--[if mso]><td class="t57" style="width:480px;"><![endif]-->
                                                                    <p class="t63" style="
                                                                                margin: 0;
                                                                                margin: 0;
                                                                                font-family: BlinkMacSystemFont,
                                                                                    Segoe
                                                                                        UI,
                                                                                    Helvetica
                                                                                        Neue,
                                                                                    Arial,
                                                                                    sans-serif,
                                                                                    'Lato';
                                                                                line-height: 21px;
                                                                                font-weight: 400;
                                                                                font-style: normal;
                                                                                font-size: 16px;
                                                                                text-decoration: none;
                                                                                text-transform: none;
                                                                                letter-spacing: -0.64px;
                                                                                direction: ltr;
                                                                                color: #dbdbdb;
                                                                                text-align: left;
                                                                                mso-line-height-rule: exactly;
                                                                                mso-text-raise: 2px;
                                                                            ">
                                                                        ${name}
                                                                        has
                                                                        sent
                                                                        you
                                                                        a
                                                                        new
                                                                        message
                                                                        through
                                                                        the
                                                                        contact
                                                                        form.
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <table class="t46" role="presentation" cellpadding="0"
                                                            cellspacing="0" align="center">
                                                            <tr>
                                                                <!--[if !mso]><!-->
                                                                <td class="t47" style="
                                                                            width: 480px;
                                                                        ">
                                                                    <!--<![endif]-->
                                                                    <!--[if mso]><td class="t47" style="width:480px;"><![endif]-->
                                                                    <p class="t53" style="
                                                                                margin: 0;
                                                                                margin: 0;
                                                                                font-family: BlinkMacSystemFont,
                                                                                    Segoe
                                                                                        UI,
                                                                                    Helvetica
                                                                                        Neue,
                                                                                    Arial,
                                                                                    sans-serif,
                                                                                    'Lato';
                                                                                line-height: 21px;
                                                                                font-weight: 400;
                                                                                font-style: normal;
                                                                                font-size: 16px;
                                                                                text-decoration: none;
                                                                                text-transform: none;
                                                                                letter-spacing: -0.64px;
                                                                                direction: ltr;
                                                                                color: #dbdbdb;
                                                                                text-align: left;
                                                                                mso-line-height-rule: exactly;
                                                                                mso-text-raise: 2px;
                                                                            ">
                                                                        Click
                                                                        below
                                                                        to
                                                                        view
                                                                        the
                                                                        message.
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="t32" style="
                                                                    mso-line-height-rule: exactly;
                                                                    mso-line-height-alt: 35px;
                                                                    line-height: 35px;
                                                                    font-size: 1px;
                                                                    display: block;
                                                                ">
                                                            &nbsp;
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <table class="t34" role="presentation" cellpadding="0"
                                                            cellspacing="0" align="left">
                                                            <tr>
                                                                <!--[if !mso]><!-->
                                                                <td class="t35" style="
                                                                            background-color: #ffa600;
                                                                            width: 105px;
                                                                            text-align: center;
                                                                            line-height: 34px;
                                                                            mso-line-height-rule: exactly;
                                                                            mso-text-raise: 6px;
                                                                        ">
                                                                    <!--<![endif]-->
                                                                    <!--[if mso]><td class="t35" style="background-color:#FFA600;width:105px;text-align:center;line-height:34px;mso-line-height-rule:exactly;mso-text-raise:6px;"><![endif]-->
                                                                    <a class="t41" href="https://themediaworkshop.co.uk/dashboard/messages" style="
                                                                                display: block;
                                                                                margin: 0;
                                                                                margin: 0;
                                                                                font-family: BlinkMacSystemFont,
                                                                                    Segoe
                                                                                        UI,
                                                                                    Helvetica
                                                                                        Neue,
                                                                                    Arial,
                                                                                    sans-serif,
                                                                                    'Lato';
                                                                                line-height: 34px;
                                                                                font-weight: 900;
                                                                                font-style: normal;
                                                                                font-size: 13px;
                                                                                text-decoration: none;
                                                                                text-transform: uppercase;
                                                                                direction: ltr;
                                                                                color: #ffffff;
                                                                                text-align: center;
                                                                                mso-line-height-rule: exactly;
                                                                                mso-text-raise: 6px;
                                                                            " target="_blank">VIEW</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="t4" style="
                                            mso-line-height-rule: exactly;
                                            font-size: 1px;
                                            display: none;
                                        ">
                                    &nbsp;
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
    `;
};

export default newMessageEmailTemplate;
