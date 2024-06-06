
enum Command {
    ERREUR,
    MOTEUR_G_AV,
    MOTEUR_G_AR,
    MOTEUR_D_AV,
    MOTEUR_D_AR,
    MOTEURS_STOP,
    BUZZ
};

void init_buffer();
void decode_sequence();
void exec_cmd();
void moteurs_init();
void moteur_gauche_avant();
void moteur_droit_avant();
void moteur_gauche_arriere();
void moteur_droit_arriere();
void moteurs_stop();
void buzz();

#define BUF_IN 200    // taille max du buffer de lecture
#define LCMD 50     // taille max du tableau de la liste de commandes

char buf_in[BUF_IN];  // buffer de lecture
int buf_in_count = 0; // taille courante du buffer

int lcmd[LCMD];     // tableau de la liste des commandes à exécuter (2 entiers par commande)
int lcmd_count = 0;   // taille courante du tableau de la liste des commandes
int lcmd_pos = 0;   // position de la commande courante en cours d'exécution

int E1 = 10;  // vitesse moteur 1
int M1 = 12;  // sens moteur 1
int E2 = 11;  // vitesse moteur 2
int M2 = 13;  // sens moteur 2
int BUZZER = 4;

void setup() {
    init_buffer();
    pinMode(M1, OUTPUT);   
    pinMode(M2, OUTPUT);
    pinMode(BUZZER, OUTPUT);
    moteurs_stop();
    Serial.begin(9600);
    Serial.println("OK Arduino"); 
}

int c = -1;
int c_prec = -1;

void loop() {
  if (Serial.available()) {
    c_prec = c;
    c = Serial.read();
    if ((c == '[') && (c_prec == '[')) {
        init_buffer();
        buf_in[buf_in_count++] = '[';
    }
    else if ((c == ']') && (c_prec == ']')) {
        decode_sequence();
        lcmd_pos = 0;
    }
    else if (c != '\n') {
        buf_in[buf_in_count++] = c;
    }
  }
  exec_cmd();
}


/*******************************************************************************/
/********************* décodage de la séquence de commandes ********************/
/*******************************************************************************/

void decode_sequence() {
    lcmd_count = 0;
    int pos = 0;

    while (pos < buf_in_count) {
        if (buf_in[pos] == '[') {
            pos++;
            Command cmd = ERREUR;
            if (strncmp(&buf_in[pos], "mga]", 4) == 0) {
                cmd = MOTEUR_G_AV;
            } else if (strncmp(&buf_in[pos], "mgr]", 4) == 0) {
                cmd = MOTEUR_G_AR;
            } else if (strncmp(&buf_in[pos], "mda]", 4) == 0) {
                cmd = MOTEUR_D_AV;
            } else if (strncmp(&buf_in[pos], "mdr]", 4) == 0) {
                cmd = MOTEUR_D_AR;
            } else if (strncmp(&buf_in[pos], "stp]", 4) == 0) {
                cmd = MOTEURS_STOP;
            } else if(strncmp(&buf_in[pos], "bip]", 4) == 0) {
                cmd = BUZZ;
            }

            lcmd[lcmd_count++] = cmd;
            while (buf_in[pos] != ']' && pos < buf_in_count) pos++;
        }
        pos++;
    }
}


/*******************************************************************/
/********************* exécution d'une commande ********************/
/*******************************************************************/

void exec_cmd() {
    if (lcmd_pos >= lcmd_count) return;

    int cmd = lcmd[lcmd_pos++];
    if (cmd == MOTEUR_G_AV) moteur_gauche_avant();
    else if (cmd == MOTEUR_D_AV) moteur_droit_avant();
    else if (cmd == MOTEUR_G_AR) moteur_gauche_arriere();
    else if (cmd == MOTEUR_D_AR) moteur_droit_arriere();
    else if (cmd == MOTEURS_STOP) moteurs_stop();
    else if (cmd == BUZZ) buzz();
}

/*******************************************************************/
/************************** init_buffer ****************************/
/*******************************************************************/

void init_buffer() {
    for (int i=0 ; i<BUF_IN ; i++) {
        buf_in[i] = 0;
    }
    buf_in_count = 0;
}

/*******************************************************************/
/************************** moteur_gauche_avant ********************/
/*******************************************************************/

void moteur_gauche_avant() {
    digitalWrite(M1,LOW);
    analogWrite(E1, 255);
}

/*******************************************************************/
/************************** moteur_gauche_arriere ******************/
/*******************************************************************/

void moteur_gauche_arriere() {
    digitalWrite(M1,HIGH);
    analogWrite(E1, 255);
}

/*******************************************************************/
/************************** moteur_droit_avant *********************/
/*******************************************************************/

void moteur_droit_avant() {
    digitalWrite(M2,LOW);
    analogWrite(E2, 255);
}

/*******************************************************************/
/************************** moteur_droit_arriere *******************/
/*******************************************************************/

void moteur_droit_arriere() {
    digitalWrite(M2,HIGH);
    analogWrite(E2, 255);
}

/*******************************************************************/
/************************** moteurs_stop ***************************/
/*******************************************************************/

void moteurs_stop() {
    analogWrite(E1, 0);
    analogWrite(E2, 0);
}

/*******************************************************************/
/******************************* buzz ******************************/
/*******************************************************************/

void buzz() {
    digitalWrite(BUZZER, HIGH);
    delay(1000);
    digitalWrite(BUZZER, LOW);
}