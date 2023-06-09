@include('layouts.app')
@include('components.alert')

<!-- component -->
<div class="bg-white pt-12 pr-0 pb-12 pl-0 mt-0 mr-auto mb-0 ml-auto sm:py-16 lg:py-20">
  <div class="pt-0 pr-4 pb-0 pl-4 mt-0 mr-auto mb-0 ml-auto max-w-7xl sm:px-6 lg:px-8">
    <div class="pt-0 pr-4 pb-0 pl-4 mt-0 mr-auto mb-0 ml-auto max-w-4xl sm:px-6 lg:px-8">
      <div class="pt-0 pr-4 pb-0 pl-4 mt-0 mr-auto mb-0 ml-auto sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-xl font-bold text-gray-900">{{ __('Estos son todos tus proyectos') }}</p>
        </div>
        <form id="search_project" action="{{ route('proyectos.searchProject') }}" method="POST">
          <div class="mt-4 mr-0 mb-0 ml-0 sm:mt-0">
            <p class="sr-only">{{ __('Buscar proyecto') }}</p>
            <div class="relative">
              <div class="flex items-center pt-0 pr-0 pb-0 pl-3 absolute inset-y-0 left-0 pointer-events-none">
                <p>
                  <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewbox="0 0 24 24"
                      stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21
                      21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </p>
              </div>
              <input placeholder="Buscar proyecto" name="search_project_input" id="search_project_input" type="search" class="border block pt-2 pr-0 pb-2 pl-10 w-full py-2
                  pl-10 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"/>
            </div>
          </div>
          @csrf
          @method("POST")
        </form>
      </div>
      <div class="shadow-xl mt-8 mr-0 mb-0 ml-0 pt-4 pr-10 pb-4 pl-10 flow-root rounded-lg sm:py-2">
        <div class="pt--10 pr-0 pb-10 pl-0">
        @if(count($proyectos) === 0)
        <div class="flex items-center flex-1 min-w-0">
          <div class="mt-0 mr-0 mb-0 ml-4 flex-1 min-w-0 text-center">
              <p class="text-lg font-bold text-gray-800 truncate items-center mt-2">{{ __('No se ha encontrado ningún proyecto') }}</p>
          </div>
        </div>
        @else
          @foreach($proyectos as $proyecto)
            <div class="pt-5 pr-0 pb-0 pl-0 mt-5 mr-0 mb-0 ml-0">
              <div class="sm:flex sm:items-center sm:justify-between sm:space-x-5">
              <div class="flex items-center flex-1 min-w-0">
                  <img
                      src="https://d34u8crftukxnk.cloudfront.net/slackpress/prod/sites/6/SlackLogo_CompanyNews_SecondaryAubergine_Hero.jpg?d=500x500&amp;f=fill" class="flex-shrink-0 object-cover rounded-full btn- w-10 h-10"/>
                  <div class="mt-0 mr-0 mb-0 ml-4 flex-1 min-w-0">
                  <p class="text-lg font-bold text-gray-800 truncate">{{$proyecto->name}}</p>
                  <p class="text-gray-600 text-md">{{$proyecto->description}}</p>
                  </div>
              </div>
              <div class="mt-4 mr-0 mb-0 ml-0 pt-0 pr-0 pb-0 pl-14 flex items-center sm:space-x-6 sm:pl-0 sm:mt-0">
                  <a href="{{ route('proyectos.tareas.index', $proyecto->id) }}" class="bg-gray-800 pt-2 pr-6 pb-2 pl-6 text-lg font-medium text-gray-100 transition-all
                      duration-200 hover:bg-gray-700 rounded-lg">Ver Proyecto</a>
              </div>
              </div>
            </div>
          @endforeach
        @endif
        <div class="flex flex-row items-center text-gray-300 mt-2 px-1" onclick="openCreateProject()">
          <p class="rounded mr-2 text-2xl">+</p>
          <p class="pt-1 rounded text-sm">{{ __('Nuevo proyecto') }}</p>
        </div>
        </div>
      </div>
    </div>
  </div>
</div>

@include('Proyectos.popup')

<script src="/js/proyecto.js"></script>