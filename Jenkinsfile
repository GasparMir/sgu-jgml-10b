pipeline{
    agent any
    stages{
        stage('Preparando los servicios del proyecto...'){
            steps{
                bat '''
                    docker compose -p sgu-jgml-10b down || exit /b 0
                '''
            }
        }

        stage('Eliminando imagenes anteriores del proyecto ...'){
            steps{
                bat '''
                    for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=sgu-jgml-10b" -q') do (
                        docker rmi -f %%i
                    )
                    if errorlevel 1 (
                        echo No hay imagenes por eliminar
                    ) else (
                        echo Imagenes eliminadas correctamente
                    )
                '''
            }
        }

        stage('Obteniendo actualizacion...'){
            steps{
                checkout scm
            }
        }

        stage('Construyecto y desplegando los servicios de docker...'){
            steps{
                bat '''
                    docker compose up --build -d
                '''
            }
        }
    }


    post{
        success{
            echo'SUCCESS - Pipeline ejecutada correctamente'
        }

        failure {
            echo 'ERROR - Hubo un error al ejecutar el pipeline'
        }

        always {
            echo 'END - Pipeline finalizado'
        }
    }
}