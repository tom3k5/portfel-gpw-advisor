Specyfikacja Funkcjonalna i Techniczna: Aplikacja "Portfel GPW Advisor"

Wersja: 4.0 (Wersja dla Software House)
Data: 25 października 2025 r.
Autor: [Imię i Nazwisko], Pomysłodawca Projektu
Status: Do Wyceny i Realizacji

1. Streszczenie dla Kierownictwa (Executive Summary)

Projekt "Portfel GPW Advisor" ma na celu stworzenie innowacyjnej aplikacji mobilnej i webowej dla inwestorów indywidualnych na Giełdzie Papierów Wartościowych w Warszawie. Aplikacja rozwiązuje problem nadmiaru informacji i trudności w podejmowaniu zyskownych decyzji, dostarczając dwa razy dziennie spersonalizowane, oparte na sztucznej inteligencji raporty. Naszą unikalną propozycją wartości (USP) jest połączenie analizy portfela użytkownika, danych rynkowych w czasie rzeczywistym, analizy sentymentu z mediów społecznościowych (X) oraz predykcji AI (LSTM), aby dostarczać rekomendacje, których celem jest osiągnięcie zwrotu z inwestycji (ROI) przewyższającego benchmark WIG20. Rozwój zaplanowano w trzech zwinnych etapach (MVP), a docelowy model biznesowy opiera się na strategii freemium.

2. Wizja i Cel Biznesowy Projektu

Wizja: Stworzenie wiodącego narzędzia dla polskich inwestorów indywidualnych, które demokratyzuje dostęp do zaawansowanych analiz i inteligentnych rekomendacji, maksymalizując ich sukces inwestycyjny.

Główny Cel Biznesowy: Zdobycie pozycji lidera w niszy aplikacji wspierających inwestowanie na GPW poprzez dostarczenie produktu o najwyższej wartości dla użytkownika końcowego.

Cele Szczegółowe (KPIs):

Aktywne pozyskiwanie użytkowników: Osiągnięcie 10 000 aktywnych użytkowników w ciągu pierwszych 12 miesięcy po premierze MVP.

Utrzymanie użytkowników (Retencja): Wskaźnik retencji na poziomie >40% po 3 miesiącach.

Efektywność dla użytkownika: Osiągnięcie przez 60% aktywnych użytkowników stopy zwrotu portfela przewyższającej indeks WIG20 w danym okresie.

Monetyzacja: Skuteczne wdrożenie modelu freemium i osiągnięcie 5% konwersji do wersji płatnej w ciągu 6 miesięcy od jej wprowadzenia.

3. Użytkownicy Docelowi (Persony)

Persona 1: Anna, Początkująca Inwestorka (32 lata)

Cel: Chce świadomie pomnażać oszczędności na GPW, ale brakuje jej czasu i wiedzy do dogłębnych analiz.

Potrzeba: Proste, zrozumiałe rekomendacje (kup/sprzedaj/trzymaj) i jasne uzasadnienie, dlaczego dana akcja jest warta uwagi. Ceni sobie powiadomienia "push", które oszczędzają jej czas.

Persona 2: Marek, Aktywny Trader (45 lat)

Cel: Aktywnie zarządza portfelem, szuka przewagi rynkowej i narzędzi do szybkiej weryfikacji swoich hipotez inwestycyjnych.

Potrzeba: Dostęp do danych real-time (ceny, wolumen, short interest), analizy sentymentu, alertów o potencjalnych "short squeeze" i zaawansowanych modeli predykcyjnych do optymalizacji portfela.

4. Plan Rozwoju (Roadmap) i Etapy MVP

Projekt zostanie zrealizowany w trzech głównych etapach, co pozwoli na szybkie dostarczenie wartości i iteracyjne doskonalenie produktu. Całkowity czas realizacji MVP szacowany jest na 20 tygodni.

Etap 1: Fundament i Użyteczność (Core & Usability) - 6 tygodni

Cel: Dostarczenie działającej aplikacji z podstawowymi funkcjami, która pozwoli użytkownikom na ręczne zarządzanie portfelem i otrzymywanie statycznych raportów.

Kluczowe Funkcjonalności:

Cross-platformowy Interfejs (Dashboard): Wizualizacja portfela w formie tabeli (symbol, liczba akcji, cena zakupu, bieżąca wartość, zmiana %) oraz prostych wykresów historycznych cen.

Ręczne Zarządzanie Portfelem: Możliwość dodawania/edycji/usuwania aktywów poprzez formularz lub import z pliku CSV.

Statyczne Raporty: Dwa razy dziennie (8:00 i 16:00 CET) wysyłane powiadomienia push/email z podsumowaniem zmian w portfelu.

Podstawowe Rekomendacje: Prosty silnik rekomendacji oparty na predefiniowanych progach procentowych zmian cen (np. zmiana >5% generuje sugestię "obserwuj").

Wynik Etapu: Funkcjonalny prototyp (iOS, Android, Web) gotowy do wewnętrznych testów i prezentacji, budujący bazę pod dalszy rozwój.

Szczegółowy harmonogram tego etapu znajduje się w Załączniku A.

Etap 2: Dane i Analiza (Data & Analysis) - 6 tygodni

Cel: Wzbogacenie aplikacji o dane w czasie rzeczywistym i analizę sentymentu, co znacząco zwiększy wartość i trafność rekomendacji.

Kluczowe Funkcjonalności:

Integracja Danych Real-time: Podłączenie do API Polygon.io poprzez WebSockets w celu wyświetlania na żywo cen i wolumenów.

Analiza Sentymentu z X: Integracja z API X i wdrożenie modelu NLP (przetwarzania języka naturalnego) do oceny nastrojów rynkowych wokół spółek z portfela użytkownika.

Dynamiczne Raporty: Raporty wzbogacone o dane sentymentu (np. "JSW: 75% sentymentu pozytywnego") i alerty (np. o potencjalnym short squeeze na podstawie danych z Ortex).

Proste Predykcje ML: Wdrożenie podstawowych modeli uczenia maszynowego (np. regresja liniowa) na backendzie.

Wynik Etapu: Aplikacja dostarczająca dynamiczne, oparte na aktualnych danych rynkowych i społecznościowych, rekomendacje.

Etap 3: Inteligencja i Optymalizacja (Intelligence & Optimization) - 8 tygodni

Cel: Implementacja zaawansowanych mechanizmów AI do predykcji cen i optymalizacji portfela, co stanowi kluczowy element przewagi konkurencyjnej aplikacji.

Kluczowe Funkcjonalności:

Zaawansowane Predykcje AI: Implementacja modelu sieci neuronowej LSTM do prognozowania kursów akcji, uwzględniającego dane historyczne i sentyment.

Optymalizacja Portfela: Wdrożenie modułu optymalizacyjnego (opartego na teorii Markowitza z elementami ML) sugerującego optymalną alokację aktywów w celu maksymalizacji zysku przy zadanym ryzyku.

Backtesting Strategii: Narzędzie pozwalające użytkownikom na symulację historyczną ich strategii inwestycyjnych.

Pełne Raporty z Prawdopodobieństwem: Rekomendacje w raportach będą zawierać szacowane prawdopodobieństwo sukcesu (np. "Sugerujemy zakup JSW, prawdopodobieństwo wzrostu o 15% w ciągu 2 tygodni: 70%").

Wynik Etapu: W pełni funkcjonalny produkt MVP gotowy do publicznego uruchomienia.

5. Plan Post-MVP i Monetyzacja

Model Biznesowy: Freemium

Wersja Darmowa (Free): Dostęp do podstawowych funkcji: ręczne zarządzanie portfelem, statyczne raporty dwa razy dziennie, podstawowe rekomendacje.

Wersja Płatna (Premium - subskrypcja miesięczna/roczna):

Integracja z kontami brokerskimi i automatyczna synchronizacja portfela.

Zaawansowane raporty AI i optymalizacja portfela.

Alerty w czasie rzeczywistym (np. o short squeeze, gwałtownych zmianach sentymentu).

Funkcje Auto-Tradingu (realizacja zleceń przez API brokera).

Dostęp do narzędzi zaawansowanego zarządzania ryzykiem (VaR, tax-loss harvesting).

Funkcje społecznościowe (np. copy trading, rankingi użytkowników).

6. Wymagania Technologiczne i Niefunkcjonalne

Stos Technologiczny:

Architektura: Monorepo zarządzane przez Turborepo.

Aplikacje Klienckie:

apps/expo: Aplikacja mobilna (iOS, Android) oparta na React Native i Expo.

apps/web: Aplikacja webowa oparta na Next.js i React Native Web.

Współdzielone Pakiety:

packages/ui: Współdzielone komponenty interfejsu użytkownika.

packages/logic: Współdzielona logika biznesowa, algorytmy AI/ML.

Backend: Node.js z frameworkiem Express.js.

Sztuczna Inteligencja: Torch.js (do inferencji modeli po stronie klienta/serwera), Python z SciPy/PyTorch do trenowania modeli.

Komunikacja Real-time: WebSockets.

Baza Danych: PostgreSQL.

Wymagania Niefunkcjonalne:

Bezpieczeństwo: Priorytet. Pełne szyfrowanie komunikacji (HTTPS), zgodność z RODO, bezpieczne przechowywanie danych (szyfrowanie), implementacja uwierzytelniania dwuskładnikowego (2FA).

Skalowalność: Architektura oparta na usługach chmurowych (preferowane AWS lub GCP), zaprojektowana do obsłużenia co najmniej 10 000 równoczesnych użytkowników.

Wydajność: Czas odpowiedzi API poniżej 200 ms. Aplikacja kliencka musi działać płynnie, a aktualizacje danych real-time nie mogą blokować interfejsu.

Dostępność (Availability): Gwarantowany uptime na poziomie 99.9%.

7. Ryzyka i Założenia

Główne Ryzyka:

Dostępność i Jakość Danych z API: Opóźnienia lub zmiany w API dostawców (Polygon.io, X, Ortex) mogą wpłynąć na działanie aplikacji. (Plan mitygacji: dywersyfikacja źródeł danych, budowa warstwy abstrakcji).

Trafność Modeli AI: Modele predykcyjne mogą generować błędne sygnały. (Plan mitygacji: Jasny i widoczny disclaimer w aplikacji, że nie stanowi ona porady inwestycyjnej; ciągłe doskonalenie modeli).

Kluczowe Założenia:

Sesja GPW trwa od 8:30 do 17:00 CET, co determinuje harmonogram raportów.

Użytkownicy posiadają podstawową wiedzę na temat inwestowania na giełdzie.

Załącznik A: Szczegółowy Plan Etapu 1 (6 tygodni)

Cel: Stworzenie funkcjonalnego prototypu z ręcznym importem danych, dashboardem i statycznymi powiadomieniami.
Zespół: 2-3 deweloperów (Frontend/Mobile, Backend).
Budżet szacunkowy: 10-15k PLN (koszt roboczogodzin deweloperskich).

Tydzień	Główne Zadania	Szczegóły Techniczne	Oczekiwany Rezultat (Deliverable)
1	Setup i Architektura	Inicjalizacja monorepo (Turborepo), konfiguracja Expo, Next.js, TypeScript, ESLint, Prettier. Stworzenie shared/ui.	Działający boilerplate projektu z poprawnymi skryptami budowania.
2	Core UI: Dashboard	Implementacja komponentu tabeli portfela, wykresów (Victory), stylizacja z React Native Paper. Użycie danych mockowych.	Interaktywny ekran dashboardu wyświetlający statyczne dane.
3	Ręczny Import Portfela	Stworzenie formularza importu (symbol, ilość, cena) oraz implementacja parsera CSV (PapaParse). Zapis danych lokalnie.	Funkcjonalność dodawania/importowania pozycji do portfela.
4	Statyczne Powiadomienia	Konfiguracja Expo Notifications (push) i Nodemailer (dla mocków email). Stworzenie mockowego API dla raportów.	System wysyłający powiadomienia o stałych godzinach z danymi z portfela.
5	Podstawowe Rekomendacje i P&L	Implementacja prostej logiki rekomendacji w shared/logic. Wyświetlanie Profit/Loss na dashboardzie.	Dashboard pokazujący P&L i proste sugestie (np. kolorami/ikonami).
6	Testy, Debugging i Code Review	Pokrycie kluczowych funkcji testami jednostkowymi (Jest, >80%). Debugging. Wdrożenie na środowisko testowe.	Stabilna wersja aplikacji z Etapu 1 gotowa do wewnętrznego demo.

Podsumowanie Końcowe

Powyższa specyfikacja stanowi kompleksową podstawę do rozpoczęcia prac deweloperskich nad aplikacją "Portfel GPW Advisor". Jesteśmy otwarci na dyskusję, sugestie i dokładną wycenę przedstawionego zakresu prac. Naszym celem jest nawiązanie partnerskiej współpracy w celu stworzenia produktu, który zrewolucjonizuje sposób inwestowania na GPW.