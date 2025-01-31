"use server";

import { UserFormTypes } from "@/lib/types";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: 587,
	tls: {
		ciphers: "SSLv3",
		rejectUnauthorized: false,
	},

	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

export async function createUser(data: UserFormTypes) {
	const emailHost = await prisma.emailHost.findFirst();
	const hashedPassword = await hash(data.password, 12);
	try {
		await prisma.user.create({
			data: {
				email: data.email,
				firstname: data.firstName,
				lastname: data.lastName,
				image: data.image,
				position: data.position,
				password: hashedPassword,
			},
		});

		const mail = await transporter.sendMail({
			from: "TMW Website",
			to: data.email,
			replyTo: emailHost!.emailHost,
			subject: `New Account Created!`,
			html: `
        
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
xmlns="http://www.w3.org/1999/xhtml"
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
lang="en">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
<!--[if !mso]><!-->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="x-apple-disable-message-reformatting" content="" />
<meta content="target-densitydpi=device-dpi" name="viewport" />
<meta content="true" name="HandheldFriendly" />
<meta content="width=device-width" name="viewport" />
<meta
    name="format-detection"
    content="telephone=no, date=no, address=no, email=no, url=no" />
<style type="text/css">
    table {
        border-collapse: separate;
        table-layout: fixed;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
    }
    table td {
        border-collapse: collapse;
    }
    .ExternalClass {
        width: 100%;
    }
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
        line-height: 100%;
    }
    body,
    a,
    li,
    p,
    h1,
    h2,
    h3 {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
    }
    html {
        -webkit-text-size-adjust: none !important;
    }
    body,
    #innerTable {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    #innerTable img + div {
        display: none;
        display: none !important;
    }
    img {
        margin: 0;
        padding: 0;
        -ms-interpolation-mode: bicubic;
    }
    h1,
    h2,
    h3,
    p,
    a {
        line-height: 1;
        overflow-wrap: normal;
        white-space: normal;
        word-break: break-word;
    }
    a {
        text-decoration: none;
    }
    h1,
    h2,
    h3,
    p {
        min-width: 100% !important;
        width: 100% !important;
        max-width: 100% !important;
        display: inline-block !important;
        border: 0;
        padding: 0;
        margin: 0;
    }
    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }
    a[href^="mailto"],
    a[href^="tel"],
    a[href^="sms"] {
        color: inherit;
        text-decoration: none;
    }
    img,
    p {
        margin: 0;
        margin: 0;
        font-family: Lato, BlinkMacSystemFont, Segoe UI, Helvetica Neue,
            Arial, sans-serif;
        line-height: 22px;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
    h1 {
        margin: 0;
        margin: 0;
        font-family: Roboto, BlinkMacSystemFont, Segoe UI,
            Helvetica Neue, Arial, sans-serif;
        line-height: 34px;
        font-weight: 400;
        font-style: normal;
        font-size: 28px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
    h2 {
        margin: 0;
        margin: 0;
        font-family: Lato, BlinkMacSystemFont, Segoe UI, Helvetica Neue,
            Arial, sans-serif;
        line-height: 30px;
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
    h3 {
        margin: 0;
        margin: 0;
        font-family: Lato, BlinkMacSystemFont, Segoe UI, Helvetica Neue,
            Arial, sans-serif;
        line-height: 26px;
        font-weight: 400;
        font-style: normal;
        font-size: 20px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
</style>
<style type="text/css">
    @media (min-width: 481px) {
        .hd {
            display: none !important;
        }
    }
</style>
<style type="text/css">
    @media (max-width: 480px) {
        .hm {
            display: none !important;
        }
    }
</style>
<style type="text/css">
    [style*="Lato"] {
        font-family: "Lato", BlinkMacSystemFont, Segoe UI,
            Helvetica Neue, Arial, sans-serif !important;
    }
    @media only screen and (min-width: 481px) {
        img,
        p {
            margin: 0;
            margin: 0;
            font-family: Lato, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 22px;
            font-weight: 400;
            font-style: normal;
            font-size: 16px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        h1 {
            margin: 0;
            margin: 0;
            font-family: Roboto, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 34px;
            font-weight: 400;
            font-style: normal;
            font-size: 28px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        h2 {
            margin: 0;
            margin: 0;
            font-family: Lato, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 30px;
            font-weight: 400;
            font-style: normal;
            font-size: 24px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        h3 {
            margin: 0;
            margin: 0;
            font-family: Lato, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 26px;
            font-weight: 400;
            font-style: normal;
            font-size: 20px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        .t3,
        .t4 {
            mso-line-height-alt: 60px !important;
            line-height: 60px !important;
            display: block !important;
        }
        .t5 {
            mso-line-height-alt: 20px !important;
            line-height: 20px !important;
            display: block !important;
        }
        .t9 {
            border-radius: 8px !important;
            overflow: hidden !important;
            padding: 60px !important;
        }
        .t11 {
            padding: 60px !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            width: 480px !important;
        }
        .t25,
        .t47,
        .t57 {
            width: 600px !important;
        }
    }
</style>
<style type="text/css" media="screen and (min-width:481px)">
    .moz-text-html img,
    .moz-text-html p {
        margin: 0;
        margin: 0;
        font-family: Lato, BlinkMacSystemFont, Segoe UI, Helvetica Neue,
            Arial, sans-serif;
        line-height: 22px;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
    .moz-text-html h1 {
        margin: 0;
        margin: 0;
        font-family: Roboto, BlinkMacSystemFont, Segoe UI,
            Helvetica Neue, Arial, sans-serif;
        line-height: 34px;
        font-weight: 400;
        font-style: normal;
        font-size: 28px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
    .moz-text-html h2 {
        margin: 0;
        margin: 0;
        font-family: Lato, BlinkMacSystemFont, Segoe UI, Helvetica Neue,
            Arial, sans-serif;
        line-height: 30px;
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
    .moz-text-html h3 {
        margin: 0;
        margin: 0;
        font-family: Lato, BlinkMacSystemFont, Segoe UI, Helvetica Neue,
            Arial, sans-serif;
        line-height: 26px;
        font-weight: 400;
        font-style: normal;
        font-size: 20px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
    }
    .moz-text-html .t3,
    .moz-text-html .t4 {
        mso-line-height-alt: 60px !important;
        line-height: 60px !important;
        display: block !important;
    }
    .moz-text-html .t9 {
        border-radius: 8px !important;
        overflow: hidden !important;
        padding: 60px !important;
    }
    .moz-text-html .t11 {
        padding: 60px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        width: 480px !important;
    }
    .moz-text-html .t25,
    .moz-text-html .t47,
    .moz-text-html .t57 {
        width: 600px !important;
    }
</style>
<!--[if !mso]><!-->
<link
    href="https://fonts.googleapis.com/css2?family=Lato:wght@400;800;900&amp;display=swap"
    rel="stylesheet"
    type="text/css" />
<!--<![endif]-->
<!--[if mso]>
    <style type="text/css">
        img,
        p {
            margin: 0;
            margin: 0;
            font-family: Lato, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 22px;
            font-weight: 400;
            font-style: normal;
            font-size: 16px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        h1 {
            margin: 0;
            margin: 0;
            font-family: Roboto, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 34px;
            font-weight: 400;
            font-style: normal;
            font-size: 28px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        h2 {
            margin: 0;
            margin: 0;
            font-family: Lato, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 30px;
            font-weight: 400;
            font-style: normal;
            font-size: 24px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        h3 {
            margin: 0;
            margin: 0;
            font-family: Lato, BlinkMacSystemFont, Segoe UI,
                Helvetica Neue, Arial, sans-serif;
            line-height: 26px;
            font-weight: 400;
            font-style: normal;
            font-size: 20px;
            text-decoration: none;
            text-transform: none;
            letter-spacing: 0;
            direction: ltr;
            color: #333;
            text-align: left;
            mso-line-height-rule: exactly;
            mso-text-raise: 2px;
        }
        div.t3,
        div.t4 {
            mso-line-height-alt: 60px !important;
            line-height: 60px !important;
            display: block !important;
        }
        td.t9 {
            border-radius: 8px !important;
            overflow: hidden !important;
            padding: 60px !important;
        }
        td.t11 {
            padding: 60px !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            width: 600px !important;
        }
        td.t25,
        td.t47,
        td.t57 {
            width: 600px !important;
        }
    </style>
<![endif]-->
<!--[if mso]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG />
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
<![endif]-->
</head>
<body
class="t0"
style="
    min-width: 100%;
    margin: 0px;
    padding: 0px;
    background-color: #f4f4f4;
">
<div class="t1" style="background-color: #f4f4f4">
    <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        align="center">
        <tr>
            <td
                class="t2"
                style="
                    font-size: 0;
                    line-height: 0;
                    mso-line-height-rule: exactly;
                    background-color: #f4f4f4;
                "
                valign="top"
                align="center">
                <!--[if mso]>
                    <v:background
                        xmlns:v="urn:schemas-microsoft-com:vml"
                        fill="true"
                        stroke="false">
                        <v:fill color="#F4F4F4" />
                    </v:background>
                <![endif]-->
                <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    align="center"
                    id="innerTable">
                    <tr>
                        <td>
                            <div
                                class="t3"
                                style="
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
                            <table
                                class="t10"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                align="center">
                                <tr>
                                    <!--[if !mso]><!-->
                                    <td
                                        class="t11"
                                        style="
                                            background-color: #000000;
                                            width: 400px;
                                            padding: 40px 40px 40px 40px;
                                        ">
                                        <!--<![endif]-->
                                        <!--[if mso]><td class="t11" style="background-color:#000000;width:480px;padding:40px 40px 40px 40px;"><![endif]-->
                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellpadding="0"
                                            cellspacing="0">
                                            <tr>
                                                <td>
                                                    <table
                                                        class="t14"
                                                        role="presentation"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        align="left">
                                                        <tr>
                                                            <!--[if !mso]><!-->
                                                            <td
                                                                class="t15"
                                                                style="
                                                                    width: 370px;
                                                                    padding: 0
                                                                        15px
                                                                        0
                                                                        0;
                                                                ">
                                                                <!--<![endif]-->
                                                                <!--[if mso]><td class="t15" style="width:385px;padding:0 15px 0 0;"><![endif]-->
                                                                <div
                                                                    style="
                                                                        font-size: 0px;
                                                                    ">
                                                                    <img
                                                                        class="t21"
                                                                        style="
                                                                            display: block;
                                                                            border: 0;
                                                                            height: auto;
                                                                            width: 100%;
                                                                            margin: 0;
                                                                            max-width: 100%;
                                                                        "
                                                                        width="370"
                                                                        height="29.28125"
                                                                        alt=""
                                                                        src="https://uploads.tabular.email/e/d7da6daa-2d54-4310-a95f-0185f4a8e2e1/f0e8a285-ccfd-4cef-a3f6-f416cf5be5fe.png" />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div
                                                        class="t13"
                                                        style="
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
                                                    <table
                                                        class="t24"
                                                        role="presentation"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        align="center">
                                                        <tr>
                                                            <!--[if !mso]><!-->
                                                            <td
                                                                class="t25"
                                                                style="
                                                                    width: 480px;
                                                                ">
                                                                <!--<![endif]-->
                                                                <!--[if mso]><td class="t25" style="width:480px;"><![endif]-->
                                                                <h1
                                                                    class="t31"
                                                                    style="
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
                                                                    A
                                                                    new
                                                                    account
                                                                    has
                                                                    been
                                                                    created
                                                                    for
                                                                    you.
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div
                                                        class="t23"
                                                        style="
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
                                                    <table
                                                        class="t56"
                                                        role="presentation"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        align="center">
                                                        <tr>
                                                            <!--[if !mso]><!-->
                                                            <td
                                                                class="t57"
                                                                style="
                                                                    width: 480px;
                                                                ">
                                                                <!--<![endif]-->
                                                                <!--[if mso]><td class="t57" style="width:480px;"><![endif]-->
                                                                <p
                                                                    class="t63"
                                                                    style="
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
                                                                    Sign
                                                                    in
                                                                    with
                                                                    you
                                                                    email
                                                                    and
                                                                    the
                                                                    following
                                                                    password.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <div
                                                        class="t5"
                                                        style="
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
                                                    <table
                                                        style="
                                                            background-color: #ffffff;
                                                            border-radius: 10px;
                                                        "
                                                        class="t46"
                                                        role="presentation"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        align="center">
                                                        <tr class="t5">
                                                            <!--[if !mso]><!-->
                                                            <td
                                                                style="
                                                                    width: 480px;
                                                                ">
                                                                <!--<![endif]-->
                                                                <!--[if mso]><td class="t47" style="width:480px;"><![endif]-->
                                                                <h1
                                                                    class="t53"
                                                                    style="
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

                                                                        line-height: 62px;
                                                                        font-weight: 500;
                                                                        font-style: normal;
                                                                        font-size: 23px;
                                                                        text-decoration: none;
                                                                        text-transform: none;
                                                                        letter-spacing: -0.64px;
                                                                        direction: ltr;
                                                                        color: #000000;
                                                                        text-align: center;
                                                                        mso-line-height-rule: exactly;
                                                                        mso-text-raise: 2px;
                                                                    ">
                                                                    ${
																		data.password
																	}
                                                                </h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div
                                                        class="t32"
                                                        style="
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
                                                    <table
                                                        class="t34"
                                                        role="presentation"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        align="left">
                                                        <tr>
                                                            <!--[if !mso]><!-->
                                                            <td
                                                                class="t35"
                                                                style="
                                                                    background-color: #ffa600;
                                                                    width: 105px;
                                                                    text-align: center;
                                                                    line-height: 34px;
                                                                    mso-line-height-rule: exactly;
                                                                    mso-text-raise: 6px;
                                                                ">
                                                                <!--<![endif]-->
                                                                <!--[if mso]><td class="t35" style="background-color:#FFA600;width:105px;text-align:center;line-height:34px;mso-line-height-rule:exactly;mso-text-raise:6px;"><![endif]-->
                                                                <a
                                                                    class="t41"
                                                                    href="${
																		process
																			.env
																			.NEXTAUTH_URL +
																		"dashboard"
																	}"
                                                                    style="
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
                                                                    "
                                                                    target="_blank"
                                                                    >LOG
                                                                    IN</a
                                                                >
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
                            <div
                                class="t4"
                                style="
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

        `,
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, data.password);
	} catch (error) {
		return createResponse(false, null, error);
	}
}
