pipeline {
agent any


environment {
    PROJECT_DIR = "/home/andre/websites-feitos/meninadahorta"
    BACKUP_DIR = "/home/andre/backups/postgres"
    RELEASE_DIR = "/home/andre/backups/releases"
}

stages {

    stage('Backup Database') {
        steps {
            sh '''
            mkdir -p $BACKUP_DIR

            docker exec meninadahorta_postgres pg_dump -U admin meninadahorta > \
            $BACKUP_DIR/backup-$(date +%F-%H-%M-%S).sql
            '''
        }
    }

    stage('Backup Current Release') {
        steps {
            sh '''
            mkdir -p $RELEASE_DIR

            tar -czf \
            $RELEASE_DIR/release-$(date +%F-%H-%M-%S).tar.gz \
            -C /home/andre/websites-feitos meninadahorta
            '''
        }
    }

    stage('Sync Project') {
        steps {
            sh '''
            rsync -av --delete \
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

        sh '''
        echo "Rollback automático iniciado..."

        LAST_BACKUP=$(ls -t $RELEASE_DIR/*.tar.gz | head -n 1)

        rm -rf $PROJECT_DIR

        mkdir -p /home/andre/websites-feitos

        tar -xzf $LAST_BACKUP -C /home/andre/websites-feitos

        cd $PROJECT_DIR

        docker compose up -d --build
        '''
    }

}


}
