import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import ProTip from './ProTip';

import crypto from 'crypto';

import { cryptByNodeApi, decryptByNodeApi, createCipheriv, createDecipheriv } from './libs/nodeCrypto';
import { cryptByBrowserApi, decryptByBrowserApi, generateKeyByBrowserApi, importKeyByBrowserApi } from './libs/browserCrypto';

const useStyles = makeStyles(theme => ({
  plainText: {
    marginBottom: theme.spacing(2),
  },
  buttons: {
    marginTop: theme.spacing(3),
  },
}));

// for plain large text 
// console.log = () => { };

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright c '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function App() {
  const classes = useStyles();

  const [plainText, setPlainText] = React.useState('');
  const [decryptedText, setDecryptedText] = React.useState('');

  async function handleClickNodeToBrowser() {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = Buffer.alloc(16, 0);

    const cipher = createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.from(await cryptByNodeApi(cipher, plainText), "hex").buffer;

    const keyForbrowser = await importKeyByBrowserApi(key);

    setDecryptedText(await decryptByBrowserApi(encrypted, keyForbrowser, iv));
  }

  async function handleClickBrowser() {
    const key = await generateKeyByBrowserApi();

    // The iv must never be reused with a given key.
    // const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = new Uint8Array(16);

    const encrypted = await cryptByBrowserApi(plainText, key, iv);

    setDecryptedText(await decryptByBrowserApi(encrypted, key, iv));
  }

  // https://nodejs.org/api/crypto.html#crypto_class_cipher
  async function handleClickNode() {
    const algorithm = 'aes-256-cbc';

    // Use async `crypto.scrypt()` instead.
    // const key = await crypto.scrypt(password, 'salt', 32); // <= not implemented on browser
    let key = crypto.randomBytes(32);

    // Use `crypto.randomBytes()` to generate a random iv instead of the static iv shown here.
    const iv = Buffer.alloc(16, 0); // Must be a multiple of 128 bits

    const cipher = createCipheriv(algorithm, key, iv);
    const encrypted = await cryptByNodeApi(cipher, plainText);

    const decipher = createDecipheriv(algorithm, key, iv);
    setDecryptedText(await decryptByNodeApi(decipher, encrypted));
  }

  function handleInput(event) {
    setPlainText(event.target.value);
  }

  function handleClickClear() {
    setPlainText("");
    setDecryptedText("");
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Encryption and decryption on the browser.
        </Typography>
        <TextField label="Plain Text" fullWidth className={classes.plainText} onChange={handleInput} value={plainText} />
        <Typography variant="body1" component="h5" gutterBottom>
          DecryptedText:{decryptedText}
        </Typography>
        <Typography variant="body1" component="h5" gutterBottom>
          Is plain text equal decrypted text?:{String(plainText === decryptedText)}
        </Typography>
        <Button variant="contained" color="primary" fullWidth className={classes.buttons} onClick={handleClickBrowser}>
          Browser API
        </Button>
        <Button variant="contained" color="primary" fullWidth className={classes.buttons} onClick={handleClickNode}>
          Node.js API
        </Button>
        <Button variant="contained" color="primary" fullWidth className={classes.buttons} onClick={handleClickNodeToBrowser}>
          Node.js crypto API => Browser dencrypto API
        </Button>
        <Button variant="contained" color="secondary" fullWidth className={classes.buttons} onClick={handleClickClear}>
          Clear text
        </Button>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
