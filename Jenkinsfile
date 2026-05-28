
pipeline {

    agent any

    environment {
        PROJECT_DIR = "/home/andre/websites-feitos/meninadahorta"
        BACKUP_DIR = "/home/andre/backups/postgres"
        RELEASE_DIR = "/home/andre/backups/releases"
    }

    stages {

        stage('Validate Project') {
            steps {
                sh '''
                echo "Validando projeto..."

                if [ ! -f docker-compose.yml ]; then
                    echo "docker-compose.yml não encontrado!"
                    exit 1
                fi
                '''
            }
        }

        stage('Backup Database') {
            steps {
                sh '''
                mkdir -p $BACKUP_DIR

                BACKUP_FILE=$BACKUP_DIR/backup-$(date +%F-%H-%M-%S).sql.gz

                docker exec meninadahorta_postgres \
                pg_dump -U admin meninadahorta | gzip > $BACKUP_FILE

                echo "Backup criado: $BACKUP_FILE"
                '''
            }
        }

        stage('Backup Current Release') {
            steps {
                sh '''
                mkdir -p $RELEASE_DIR

                BACKUP_NAME=release-$(date +%F-%H-%M-%S).tar.gz

                tar -czf \
                $RELEASE_DIR/$BACKUP_NAME \
                -C /home/andre/websites-feitos \
                meninadahorta

                echo "Backup release criado: $BACKUP_NAME"
                '''
            }
        }

        stage('Sync Project') {
            steps {
                sh '''
                mkdir -p $PROJECT_DIR

                rsync -av \
                --exclude '.git' \
                --exclude '.env' \
                --exclude 'node_modules' \
                --exclude '__pycache__' \
                ./ $PROJECT_DIR/
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                cd $PROJECT_DIR

                docker compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                cd $PROJECT_DIR

                docker compose up -d
                '''
            }
        }

    }

    post {

        success {
            echo 'Deploy concluído com sucesso!'
        }

        failure {

            echo 'Deploy falhou!'
            echo 'Rollback seguro iniciado...'

            sh '''
            LAST_BACKUP=$(ls -t $RELEASE_DIR/*.tar.gz | head -n 1)

            mkdir -p /home/andre/rollback-temp

            rm -rf /home/andre/rollback-temp/*

            tar -xzf $LAST_BACKUP -C /home/andre/rollback-temp

            if [ -f /home/andre/rollback-temp/meninadahorta/docker-compose.yml ]; then

                echo "Backup válido encontrado"

                mkdir -p /home/andre/websites-feitos

                rsync -av \
                /home/andre/rollback-temp/meninadahorta/ \
                $PROJECT_DIR/

                cd $PROJECT_DIR

                docker compose up -d --build

            else

                echo "Rollback inválido!"
                exit 1

            fi
            '''
        }
    }
}

