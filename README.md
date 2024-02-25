# Agendamento de Consultas em Clínicas Psicológicas

## Subdomínios para Agendamento de Consultas em Clínicas Psicológicas

**Bounded Context:**

* **Autenticação:**
    * Gerencia o processo de autenticação de usuários, incluindo pacientes e psicólogos.
* **Paciente:**
    * Gerencia as informações dos pacientes, incluindo cadastro, consultas agendadas e histórico de consultas.
* **Psicólogo:**
    * Gerencia as informações dos psicólogos, incluindo cadastro, especialidades, horários de disponibilidade, consultas agendadas e histórico de consultas.
* **Agendamento:**
    * Gerencia o processo de agendamento de consultas, incluindo a busca por psicólogos disponíveis, a seleção de horários e a confirmação de agendamentos.
* **Consulta:**
    * Gerencia as informações das consultas, incluindo data, hora, duração, status, paciente, psicólogo e observações.
* **Pagamento:**
    * Gerencia o processo de pagamento das consultas, caso a clínica utilize essa funcionalidade.
* **Notificação:**
    * Envia notificações por email ou SMS para pacientes e psicólogos sobre consultas agendadas, confirmadas, canceladas ou concluídas.

**Entidades:**

* **Paciente:**
    * Atributos: nome, email, telefone, data de nascimento, plano de saúde (opcional).
* **Psicólogo:**
    * Atributos: nome, email, telefone, especialidade, CRP, foto (opcional).
* **Consulta:**
    * Atributos: data, hora, duração, status (agendada, confirmada, cancelada, concluída), paciente, psicólogo, observações (opcional).
* **Horário de Disponibilidade:**
    * Atributos: dia da semana, hora de início, hora de término, psicólogo.

**Value Objects:**

* **Nome:** string com no máximo 255 caracteres.
* **Email:** string válida no formato RFC 5322.
* **Telefone:** string com no máximo 15 caracteres.
* **Data de Nascimento:** data no formato YYYY-MM-DD.
* **Plano de Saúde:** string com no máximo 255 caracteres (opcional).
* **Especialidade:** string com no máximo 255 caracteres.
* **CRP:** string com no máximo 15 caracteres.
* **Data:** data no formato YYYY-MM-DD.
* **Hora:** hora no formato HH:MM.
* **Duração:** número inteiro em minutos.
* **Observações:** string com no máximo 1000 caracteres (opcional).

**Casos de Uso:**

* **Paciente:**
    * Cadastrar-se
    * Autenticar-se
    * Visualizar psicólogos disponíveis
    * Visualizar horários disponíveis de um psicólogo
    * Agendar consulta
    * Visualizar consultas agendadas
    * Cancelar consulta
* **Psicólogo:**
    * Cadastrar-se
    * Autenticar-se
    * Adicionar horários de disponibilidade
    * Alterar horários de disponibilidade
    * Visualizar consultas agendadas
    * Cancelar consulta
    * Marcar consulta como concluída

**Aggregates:**

* **Paciente:**
    * Representa um paciente e suas consultas agendadas.
* **Psicólogo:**
    * Representa um psicólogo e suas consultas agendadas.
* **Consulta:**
    * Representa uma consulta individual.

**Eventos de Domínio:**

* **Paciente Cadastrado:**
    * Ocorre quando um novo paciente se cadastra na plataforma.
* **Paciente Autenticado:**
    * Ocorre quando um paciente se autentica na plataforma.
* **Consulta Agendada:**
    * Ocorre quando um paciente agenda uma consulta.
* **Consulta Cancelada:**
    * Ocorre quando um paciente ou psicólogo cancela uma consulta.
* **Consulta Concluída:**
    * Ocorre quando um psicólogo marca uma consulta como concluída.